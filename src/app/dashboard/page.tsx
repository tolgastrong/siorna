import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  trend?: { value: string; positive: boolean }
  accent?: string
  icon: string
}

interface ActivityItem {
  member: string
  action: string
  source: string
  time: string
  type: 'commit' | 'pr' | 'ticket'
}

interface ReportItem {
  type: string
  label: string
  period: string
  status: 'sent' | 'pending' | 'scheduled'
  members: number
  events: number
}

// ─── Mock data (DB'den gelecek, şimdilik placeholder) ────
const MOCK_ACTIVITY: ActivityItem[] = [
  { member: 'You', action: 'Set up Siorna', source: 'siorna', time: 'just now', type: 'commit' },
]

const MOCK_REPORTS: ReportItem[] = [
  {
    type: 'daily',
    label: 'Daily Standup',
    period: 'Today',
    status: 'scheduled',
    members: 0,
    events: 0,
  },
  {
    type: 'weekly',
    label: 'Weekly Summary',
    period: 'This week',
    status: 'scheduled',
    members: 0,
    events: 0,
  },
]

const INTEGRATIONS = [
  { id: 'github',  label: 'GitHub',  icon: '🐙', color: '#58A6FF', description: 'Commits & Pull Requests' },
  { id: 'linear',  label: 'Linear',  icon: '🔷', color: '#5E6AD2', description: 'Issues & Cycles' },
  { id: 'jira',    label: 'Jira',    icon: '🔵', color: '#0052CC', description: 'Tickets & Sprints' },
  { id: 'trello',  label: 'Trello',  icon: '🟦', color: '#0079BF', description: 'Cards & Boards' },
  { id: 'slack',   label: 'Slack',   icon: '💬', color: '#E01E5A', description: 'Report Delivery' },
]

// ─── Main Page ───────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // DB'den gerçek veriler (henüz bağlı değilse 0 döner)
  const { count: memberCount } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })

  const { count: reportCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })

  const { data: connections } = await supabase
  .from('oauth_connections')
  .select('provider') as { data: { provider: string }[] | null }

const connectedProviders = new Set(
  connections?.map((c: { provider: string }) => c.provider) ?? []
)
  const integrationCount = connectedProviders.size

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'there'

  const isNewUser = integrationCount === 0 && (memberCount ?? 0) <= 1

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#504E60',
              marginBottom: 6,
              fontFamily: "'DM Mono', monospace",
            }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </p>
            <h1 style={{
              fontSize: 28,
              fontWeight: 600,
              margin: 0,
              letterSpacing: '-0.03em',
              color: '#F0EEF8',
            }}>
              Good {getTimeOfDay()}, {firstName}.
            </h1>
            <p style={{ color: '#9896A8', fontSize: 14, margin: '6px 0 0', lineHeight: 1.6 }}>
              {isNewUser
                ? "Let's set up your engineering visibility stack."
                : `Your team has ${integrationCount} active integration${integrationCount !== 1 ? 's' : ''}.`}
            </p>
          </div>

          {!isNewUser && (
            <Link href="/dashboard/integrations" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              background: '#7B6EF6',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}>
              + Add Integration
            </Link>
          )}
        </div>
      </header>

      {/* ── Onboarding Banner (yeni kullanıcı) ── */}
      {isNewUser && (
        <div style={{
          background: 'linear-gradient(135deg, #1A1730 0%, #111115 100%)',
          border: '1px solid #2A2540',
          borderRadius: 16,
          padding: '32px 36px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Dekoratif arka plan */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(123,110,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36,
              background: 'rgba(123,110,246,0.15)',
              border: '1px solid rgba(123,110,246,0.3)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🚀</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#F0EEF8' }}>
                Welcome to Siorna
              </div>
              <div style={{ fontSize: 12, color: '#9896A8' }}>
                3 steps to your first automated report
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              {
                step: '01',
                title: 'Connect your tools',
                desc: 'GitHub, Linear, Jira or Trello',
                href: '/dashboard/integrations',
                done: integrationCount > 0,
              },
              {
                step: '02',
                title: 'Add team members',
                desc: 'Invite your engineering team',
                href: '/dashboard/team',
                done: (memberCount ?? 0) > 1,
              },
              {
                step: '03',
                title: 'Connect Slack',
                desc: 'Choose your report channel',
                href: '/dashboard/integrations',
                done: connectedProviders.has('slack'),
              },
            ].map((item) => (
              <Link key={item.step} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: item.done ? 'rgba(61,214,140,0.06)' : '#0C0C0E',
                  border: `1px solid ${item.done ? 'rgba(61,214,140,0.2)' : '#222228'}`,
                  borderRadius: 12,
                  padding: '18px 20px',
                  transition: 'border-color 0.15s',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: item.done ? '#3DD68C' : '#504E60',
                      letterSpacing: '0.1em',
                    }}>
                      STEP {item.step}
                    </span>
                    <span style={{ fontSize: 14 }}>{item.done ? '✅' : '⭕'}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EEF8', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#504E60' }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 28,
      }}>
        <StatCard
          icon="🔌"
          title="Integrations"
          value={integrationCount}
          subtitle="Connected tools"
          accent="#7B6EF6"
        />
        <StatCard
          icon="👥"
          title="Team Members"
          value={memberCount ?? 0}
          subtitle="Active members"
          accent="#3DD68C"
        />
        <StatCard
          icon="📋"
          title="Reports"
          value={reportCount ?? 0}
          subtitle="Generated total"
          accent="#F5A623"
        />
        <StatCard
          icon="📡"
          title="Next Report"
          value="—"
          subtitle="Connect tools first"
          accent="#58A6FF"
        />
      </div>

      {/* ── İki kolon: Raporlar + Entegrasyonlar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Rapor takvimi */}
        <Section title="Report Schedule" action={{ label: 'View all', href: '/dashboard/reports' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Daily Standup', schedule: 'Every weekday · 9:00 AM ET', channel: '#standup', color: '#3DD68C' },
              { label: 'Weekly Summary', schedule: 'Every Friday · 5:00 PM ET', channel: 'Email + Slack', color: '#7B6EF6' },
              { label: 'Sprint Review', schedule: '1st & 15th of month', channel: 'Email', color: '#F5A623' },
              { label: 'Monthly Report', schedule: 'Last day of month', channel: 'Email + PDF', color: '#F26B6B' },
            ].map((r) => (
              <div key={r.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: '#0C0C0E',
                border: '1px solid #1A1A22',
                borderRadius: 10,
              }}>
                <div style={{
                  width: 3, height: 36,
                  borderRadius: 2,
                  background: r.color,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EEF8', marginBottom: 2 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#504E60', fontFamily: "'DM Mono', monospace" }}>
                    {r.schedule}
                  </div>
                </div>
                <div style={{
                  fontSize: 10,
                  color: '#9896A8',
                  background: '#18181E',
                  padding: '3px 8px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}>
                  {r.channel}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Entegrasyon durumu */}
        <Section title="Integrations" action={{ label: 'Manage', href: '/dashboard/integrations' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INTEGRATIONS.map((int) => {
              const connected = connectedProviders.has(int.id)
              return (
                <div key={int.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#0C0C0E',
                  border: `1px solid ${connected ? 'rgba(61,214,140,0.15)' : '#1A1A22'}`,
                  borderRadius: 10,
                }}>
                  <div style={{
                    width: 34, height: 34,
                    borderRadius: 8,
                    background: connected ? `${int.color}18` : '#18181E',
                    border: `1px solid ${connected ? `${int.color}30` : '#222228'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {int.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EEF8', marginBottom: 1 }}>
                      {int.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#504E60' }}>{int.description}</div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    color: connected ? '#3DD68C' : '#504E60',
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    <div style={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      background: connected ? '#3DD68C' : '#2A2A32',
                      boxShadow: connected ? '0 0 6px #3DD68C' : 'none',
                    }} />
                    {connected ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      {/* ── Son aktivite ── */}
      <Section title="Recent Activity" action={{ label: 'View reports', href: '/dashboard/reports' }}>
        {MOCK_ACTIVITY.length === 0 || isNewUser ? (
          <EmptyState
            icon="📭"
            title="No activity yet"
            description="Once you connect your tools, commits, PRs and ticket updates will appear here."
            action={{ label: 'Connect tools →', href: '/dashboard/integrations' }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MOCK_ACTIVITY.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: '#0C0C0E',
                border: '1px solid #1A1A22',
                borderRadius: 8,
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: 7,
                  background: '#18181E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}>
                  {item.type === 'commit' ? '💻' : item.type === 'pr' ? '🔀' : '🎫'}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: '#9896A8' }}>
                    <span style={{ color: '#F0EEF8', fontWeight: 500 }}>{item.member}</span>
                    {' '}{item.action}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#504E60', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Security Notice ── */}
      <div style={{
        marginTop: 20,
        padding: '14px 18px',
        background: 'rgba(88,166,255,0.05)',
        border: '1px solid rgba(88,166,255,0.12)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <div>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#58A6FF' }}>
            Metadata-only access
          </span>
          <span style={{ fontSize: 12, color: '#504E60', marginLeft: 8 }}>
            Siorna reads only commit messages, PR titles, and ticket names. Source code and diffs are never accessed.
          </span>
          <a href="/security" style={{ fontSize: 12, color: '#7B6EF6', marginLeft: 8, textDecoration: 'none' }}>
            Learn more →
          </a>
        </div>
      </div>

    </div>
  )
}

// ─── Helper ──────────────────────────────────────────────
function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

// ─── Sub-components ──────────────────────────────────────
function StatCard({ icon, title, value, subtitle, accent }: StatCardProps) {
  return (
    <div style={{
      background: '#111115',
      border: '1px solid #1A1A22',
      borderRadius: 12,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${accent}80, ${accent}20)`,
      }} />
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 12,
      }}>
        <span style={{ fontSize: 11, color: '#504E60', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </span>
        <span style={{
          fontSize: 16,
          width: 30, height: 30,
          background: `${accent}12`,
          border: `1px solid ${accent}22`,
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: '#F0EEF8', letterSpacing: '-0.03em', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#504E60' }}>{subtitle}</div>
    </div>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: { label: string; href: string }
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#111115',
      border: '1px solid #1A1A22',
      borderRadius: 14,
      padding: '20px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#F0EEF8', margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        {action && (
          <Link href={action.href} style={{
            fontSize: 12, color: '#7B6EF6', textDecoration: 'none',
          }}>
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

function EmptyState({
  icon, title, description, action,
}: {
  icon: string
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#9896A8', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#504E60', marginBottom: action ? 16 : 0, lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
        {description}
      </div>
      {action && (
        <Link href={action.href} style={{
          display: 'inline-block',
          marginTop: 16,
          fontSize: 13,
          color: '#7B6EF6',
          textDecoration: 'none',
          fontWeight: 500,
        }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}