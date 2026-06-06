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

  // Middleware zaten koruyor ama ekstra sunucu taraflı güvenlik:
  if (!user) {
    redirect('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C0C0E', color: '#F0EEF8' }}>
      
      {/* Sidebar (Sol Menü) */}
      <aside style={{
        width: '260px',
        background: '#111115',
        borderRight: '1px solid #222228',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        {/* Logo */}
        <div style={{ padding: '0 8px', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', letterSpacing: '-0.5px', margin: 0 }}>
            Sior<span style={{ color: '#7B6EF6' }}>na</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link href="/dashboard" style={linkStyle}>
            📊 Overview
          </Link>
          <Link href="/dashboard/integrations" style={linkStyle}>
            🔌 Integrations
          </Link>
          <Link href="/dashboard/team" style={linkStyle}>
            👥 Team Members
          </Link>
          <Link href="/dashboard/settings" style={linkStyle}>
            ⚙️ Settings
          </Link>
        </nav>

        {/* User Profile & Sign Out */}
        <div style={{ 
          borderTop: '1px solid #222228', 
          paddingTop: '20px', 
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontSize: '13px', color: '#9896A8', padding: '0 8px', wordBreak: 'break-all' }}>
            {user.email}
          </div>
          
          <form action="/auth/signout" method="post">
            <button type="submit" style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: '1px solid #2A2A32',
              borderRadius: '6px',
              color: '#F26B6B',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background 0.2s'
            }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

// Menü linkleri için basit bir stil objesi
const linkStyle = {
  textDecoration: 'none',
  color: '#9896A8',
  padding: '10px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.2s',
  ':hover': {
    background: '#18181E',
    color: '#F0EEF8'
  }
}