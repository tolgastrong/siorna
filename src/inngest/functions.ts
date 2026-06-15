import { inngest } from './client'
import { createClient } from '@supabase/supabase-js'
import { collectTeamData } from '@/lib/collectors/collect'
import { generateReport } from '@/lib/report-generator'
import { Resend } from 'resend'

// ─── Clients ─────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Yardımcı: raporu kaydet + gönder ────────────────────
async function saveAndDeliver(
  teamId: string,
  type: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  periodStart: Date,
  periodEnd: Date,
  report: { slack: string; email: string; structured: any }
) {
  const supabase = getSupabase()

  const { data: team } = await supabase
    .from('teams')
    .select('name, slack_webhook, notification_email')
    .eq('id', teamId)
    .single()

  if (!team) throw new Error(`Team not found: ${teamId}`)

  const { data: savedReport, error: saveError } = await supabase
    .from('reports')
    .insert({
      team_id:      teamId,
      report_type:  type,
      period_start: periodStart.toISOString().split('T')[0],
      period_end:   periodEnd.toISOString().split('T')[0],
      content_slack:  report.slack,
      content_email:  report.email,
      raw_summary:    report.structured,
      member_count:   report.structured.memberCount,
      event_count:    report.structured.eventCount,
      ai_model:       type === 'daily' || type === 'weekly' ? 'claude-haiku-4-5' : 'claude-sonnet-4-5',
      sent_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (saveError) console.error('[siorna] Failed to save report:', saveError)

  if (team.slack_webhook) {
    const slackRes = await fetch(team.slack_webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: report.slack, unfurl_links: false }),
    })

    await supabase.from('report_deliveries').insert({
      report_id: savedReport?.id,
      channel:   'slack',
      status:    slackRes.ok ? 'sent' : 'failed',
      recipient: team.slack_webhook,
      sent_at:   new Date().toISOString(),
      error:     slackRes.ok ? null : `HTTP ${slackRes.status}`,
    })
  }

  if (team.notification_email && type !== 'daily') {
    const subjects: Record<string, string> = {
      weekly:    `Weekly Engineering Report — ${team.name}`,
      biweekly:  `Sprint Review (15 days) — ${team.name}`,
      monthly:   `Monthly Engineering Report — ${team.name}`,
    }

    const { error: emailError } = await resend.emails.send({
      from:    'Siorna Reports <reports@siorna.com>',
      to:      team.notification_email,
      subject: subjects[type],
      text:    report.email,
    })

    await supabase.from('report_deliveries').insert({
      report_id: savedReport?.id,
      channel:   'email',
      status:    emailError ? 'failed' : 'sent',
      recipient: team.notification_email,
      sent_at:   new Date().toISOString(),
      error:     emailError?.message ?? null,
    })
  }
}

// ─── Yardımcı: tüm ekipleri işle (VE SONUÇ DÖNDÜR) ───────
async function processAllTeams(
  type: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  since: Date,
  until: Date,
  step: any
) {
  const supabase = getSupabase()

  const { data: teams, error } = await supabase
    .from('teams')
    .select('id, name')
    .eq('subscription_status', 'active')

  if (!teams || teams.length === 0) {
    // Inngest Output ekranında bunu göreceğiz
    return { status: 'skipped', reason: 'No active teams found', dbError: error }
  }

  const results = []

  for (const team of teams) {
    // step.run işleminin sonucunu değişkene atıyoruz
    const stepResult = await step.run(`process-team-${team.id}`, async () => {
      try {
        const rawData = await collectTeamData(team.id, since, until)
        
        // Veri boş mu kontrolü (Tüm üyelerin eventleri sıfır mı?)
        const hasActivity = rawData.some(m => m.commits.length > 0 || m.tickets.length > 0 || m.prs.length > 0)

        if (!hasActivity) {
          return { team: team.name, status: 'skipped', reason: 'No activity found in this period' }
        }

        const report = await generateReport(type, rawData)
        await saveAndDeliver(team.id, type, since, until, report)

        return { 
          team: team.name, 
          status: 'success', 
          metrics: {
            members: report.structured.memberCount,
            events: report.structured.eventCount
          }
        }
      } catch (err: any) {
        return { team: team.name, status: 'error', error: err.message }
      }
    })
    
    results.push(stepResult)
  }

  // Bu return, tüm Inngest Output ekranını şekillendirecek
  return {
    reportType: type,
    period: { since, until },
    totalTeamsProcessed: teams.length,
    details: results
  }
}

// ─── 1. Günlük Standup ───────────────────────────────────
export const dailyStandup = inngest.createFunction(
  {
    id:   'daily-standup',
    name: 'Daily Standup Report',
    triggers: [{ cron: '0 14 * * 1-5' }],
    retries: 2,
  },
  async ({ step }) => {
    const until = new Date()
    const since = new Date()

    if (new Date().getDay() === 1) {
      since.setDate(since.getDate() - 3)
    } else {
      since.setDate(since.getDate() - 1)
    }
    since.setHours(0, 0, 0, 0)

    // AWAIT VE RETURN EKLENDİ
    const summary = await processAllTeams('daily', since, until, step)
    return summary
  }
)

// ─── 2. Haftalık Rapor ───────────────────────────────────
export const weeklyReport = inngest.createFunction(
  {
    id:   'weekly-report',
    name: 'Weekly Report',
    triggers: [{ cron: '0 22 * * 5' }],
    retries: 2,
  },
  async ({ step }) => {
    const until = new Date()
    const since = new Date()
    since.setDate(since.getDate() - 7)
    since.setHours(0, 0, 0, 0)

    return await processAllTeams('weekly', since, until, step)
  }
)

// ─── 3. 15 Günlük Rapor ──────────────────────────────────
export const biweeklyReport = inngest.createFunction(
  {
    id:   'biweekly-report',
    name: 'Biweekly Sprint Review',
    triggers: [{ cron: '0 13 1,15 * *' }],
    retries: 2,
  },
  async ({ step }) => {
    const until = new Date()
    const since = new Date()
    since.setDate(since.getDate() - 15)
    since.setHours(0, 0, 0, 0)

    return await processAllTeams('biweekly', since, until, step)
  }
)

// ─── 4. Aylık Rapor ──────────────────────────────────────
export const monthlyReport = inngest.createFunction(
  {
    id:   'monthly-report',
    name: 'Monthly Executive Report',
    triggers: [{ cron: '0 22 28-31 * *' }],
    retries: 2,
  },
  async ({ step }) => {
    return await step.run('check-last-day', async () => {
      const today    = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      if (tomorrow.getMonth() === today.getMonth()) {
        return { status: 'skipped', reason: 'Not the last day of the month' }
      }

      const until = new Date()
      const since = new Date(today.getFullYear(), today.getMonth(), 1)
      since.setHours(0, 0, 0, 0)

      return await processAllTeams('monthly', since, until, step)
    })
  }
)