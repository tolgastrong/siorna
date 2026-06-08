import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
    ?? user.email?.[0].toUpperCase()
    ?? '?'

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0C0C0E',
      color: '#F0EEF8',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240,
        background: '#0E0E12',
        borderRight: '1px solid #1A1A22',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 10px', marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 22,
            letterSpacing: '-0.5px',
            margin: 0,
            color: '#F0EEF8',
          }}>
            Sior<span style={{ color: '#7B6EF6' }}>na</span>
          </h2>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 4,
            padding: '2px 7px',
            background: 'rgba(61,214,140,0.1)',
            border: '1px solid rgba(61,214,140,0.2)',
            borderRadius: 20,
          }}>
            <div style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: '#3DD68C',
              boxShadow: '0 0 5px #3DD68C',
            }} />
            <span style={{ fontSize: 10, color: '#3DD68C', letterSpacing: '0.06em' }}>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <NavLabel>Monitor</NavLabel>
          <NavLink href="/dashboard" icon="📊" label="Overview" />
          <NavLink href="/dashboard/reports" icon="📋" label="Reports" />
          <NavLink href="/dashboard/activity" icon="⚡" label="Activity" />

          <NavLabel style={{ marginTop: 20 }}>Manage</NavLabel>
          <NavLink href="/dashboard/integrations" icon="🔌" label="Integrations" />
          <NavLink href="/dashboard/team" icon="👥" label="Team Members" />

          <NavLabel style={{ marginTop: 20 }}>Account</NavLabel>
          <NavLink href="/dashboard/settings" icon="⚙️" label="Settings" />
          <NavLink href="/dashboard/billing" icon="💳" label="Billing" />
        </nav>

        {/* Docs link */}
        <a href="https://docs.siorna.com" target="_blank" rel="noreferrer" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          borderRadius: 8,
          fontSize: 12,
          color: '#504E60',
          textDecoration: 'none',
          marginBottom: 12,
          transition: 'color 0.15s',
        }}>
          <span>📚</span> Documentation
        </a>

        {/* User */}
        <div style={{
          borderTop: '1px solid #1A1A22',
          paddingTop: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px', marginBottom: 10 }}>
            <div style={{
              width: 30, height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #7B6EF6, #A89FF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#F0EEF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name ?? user.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: 10, color: '#504E60', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button type="submit" style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: '1px solid #1A1A22',
              borderRadius: 7,
              color: '#504E60',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}>
              <span>→</span> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        flex: 1,
        padding: '40px 44px',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {children}
      </main>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────
function NavLabel({ children, style }: { children: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#2A2A32',
      padding: '0 10px',
      marginBottom: 4,
      marginTop: 4,
      fontFamily: "'DM Mono', monospace",
      ...style,
    }}>
      {children}
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '9px 10px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 400,
      color: '#9896A8',
      textDecoration: 'none',
      transition: 'all 0.15s',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </Link>
  )
}