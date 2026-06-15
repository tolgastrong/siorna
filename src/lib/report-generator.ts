import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export type ReportType = 'daily' | 'weekly' | 'biweekly' | 'monthly'

export interface ReportOutput {
  slack: string
  email: string
  structured: {
    type: ReportType
    generatedAt: string
    memberCount: number
    eventCount: number
  }
}

// ─── Prompt'lar ───────────────────────────────────────────
const PROMPTS: Record<ReportType, (data: unknown) => string> = {

  daily: (data) => `
You are an engineering standup assistant for a software team.
Convert the activity data below into a concise Slack standup report.

FORMAT (strict):
*[Name]* — Yesterday: [what they did] | Today: [what they plan] | Blockers: [any blockers or "None"]

RULES:
- Maximum 3 bullet points per developer
- Use technical language naturally
- If a developer has no activity, skip them
- Keep it scannable, not verbose
- Output in English only

DATA:
${JSON.stringify(data, null, 2)}
`,

  weekly: (data) => `
You are an engineering manager writing a weekly team summary.

Cover these sections:
1. **Shipped this week** — major completed items (feature level, not commit level)
2. **Velocity** — total commits, PRs merged, tickets closed (use exact numbers from data)
3. **Watch areas** — anything that needs attention next week
4. **Momentum** — brief outlook for the coming week

TONE: Direct report to leadership — concrete, data-driven, no filler.
FORMAT: Use markdown headers and bullet points. Keep under 400 words.

DATA:
${JSON.stringify(data, null, 2)}
`,

  biweekly: (data) => `
You are a senior engineering manager writing a sprint review report.

Analyze and cover:
1. **Commitment accuracy** — planned vs completed (estimate from ticket data)
2. **Top contributors** — most productive team members this sprint
3. **Recurring blockers** — patterns that slowed the team
4. **Carryover** — items pushed to next sprint
5. **Team health signals** — workload distribution, any warning signs

TONE: Executive-ready, suitable for sprint retrospective and management presentation.
FORMAT: Markdown. Start with a 2-sentence executive summary, then sections.

DATA:
${JSON.stringify(data, null, 2)}
`,

  monthly: (data) => `
You are a VP of Engineering writing a monthly report for the CEO and CTO.

Required sections:
1. **Executive Summary** — exactly 3 sentences covering the month's highlights
2. **What we built** — shipped features and improvements (business impact focused)
3. **Velocity trend** — month-over-month comparison if data allows
4. **Technical debt & infrastructure** — work done below the surface
5. **Team capacity** — headcount efficiency, bottlenecks
6. **Recommendations** — 2-3 concrete actions for next month

RULES:
- Every claim must be backed by a number from the data
- No vague statements like "the team worked hard"
- Format: Markdown with clear headers
- Target length: 500-700 words

DATA:
${JSON.stringify(data, null, 2)}
`,
}

// ─── Model seçimi ─────────────────────────────────────────
// Günlük ve haftalık: Haiku (hızlı + ucuz)
// 15 günlük ve aylık: Sonnet (daha derin analiz)
function getModel(type: ReportType): string {
  if (type === 'biweekly' || type === 'monthly') {
    return 'claude-sonnet-4-5'
  }
  return 'claude-haiku-4-5'
}

function getMaxTokens(type: ReportType): number {
  const limits: Record<ReportType, number> = {
    daily:    800,
    weekly:   1200,
    biweekly: 1500,
    monthly:  2000,
  }
  return limits[type]
}

// ─── Ana fonksiyon ────────────────────────────────────────
export async function generateReport(
  type: ReportType,
  rawData: unknown
): Promise<ReportOutput> {

  const prompt = PROMPTS[type](rawData)

  // Kaç üye ve event var sayalım (maliyet takibi için)
  const data = rawData as { member: string; commits: unknown[]; tickets: unknown[] }[]
  const memberCount = data?.length ?? 0
  const eventCount = data?.reduce(
    (sum, m) => sum + (m.commits?.length ?? 0) + (m.tickets?.length ?? 0),
    0
  ) ?? 0

  const response = await client.messages.create({
    model: getModel(type),
    max_tokens: getMaxTokens(type),
    messages: [{ role: 'user', content: prompt }],
  })

  const fullText =
    response.content[0].type === 'text'
      ? response.content[0].text
      : ''

  // Slack versiyonu: günlük tam metin, diğerleri kısa özet
  const slackVersion =
    type === 'daily'
      ? fullText
      : fullText.split('\n').slice(0, 10).join('\n') +
        '\n\n_Full report sent via email_ 📧'

  return {
    slack: slackVersion,
    email: fullText,
    structured: {
      type,
      generatedAt: new Date().toISOString(),
      memberCount,
      eventCount,
    },
  }
}

// ─── Test fonksiyonu (geliştirme için) ───────────────────
export async function testReport(): Promise<void> {
  const mockData = [
    {
      member: 'Alex Chen',
      commits: [
        { title: 'Fix authentication timeout bug', repo: 'backend-api', date: '2025-06-03' },
        { title: 'Add rate limiting middleware', repo: 'backend-api', date: '2025-06-03' },
      ],
      prs: [
        { title: 'Auth timeout fix', state: 'merged' },
      ],
      tickets: [
        { title: 'Login session expires too early', status: 'Done', source: 'linear' },
      ],
    },
    {
      member: 'Mia Johnson',
      commits: [
        { title: 'Dashboard redesign - initial implementation', repo: 'frontend', date: '2025-06-03' },
      ],
      prs: [],
      tickets: [
        { title: 'Redesign main dashboard', status: 'In Progress', source: 'jira' },
        { title: 'Update color tokens', status: 'Done', source: 'jira' },
      ],
    },
  ]

  console.log('Testing daily report...')
  const result = await generateReport('daily', mockData)
  console.log('\n=== SLACK VERSION ===')
  console.log(result.slack)
  console.log('\n=== EMAIL VERSION ===')
  console.log(result.email)
  console.log('\n=== STRUCTURED ===')
  console.log(result.structured)
}