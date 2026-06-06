import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ maxWidth: '900px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ color: '#9896A8', fontSize: '15px' }}>
          Here's what's happening with your engineering team today.
        </p>
      </header>

      {/* Örnek Dashboard Kartları (Skeleton) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Active Integrations" value="0" subtitle="Connect your tools" />
        <StatCard title="Reports Generated" value="0" subtitle="This month" />
        <StatCard title="Team Members" value="1" subtitle="Just you for now" />
      </div>

      <div style={{
        background: '#111115',
        border: '1px solid #222228',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Ready to automate your standups?</h3>
        <p style={{ color: '#9896A8', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
          Connect GitHub, Linear, or Jira to start generating autonomous engineering reports.
        </p>
        <button style={{
          padding: '10px 20px',
          background: '#7B6EF6',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Connect Tools
        </button>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div style={{
      background: '#111115',
      border: '1px solid #222228',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h4 style={{ color: '#9896A8', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>{title}</h4>
      <div style={{ fontSize: '32px', fontWeight: '600', color: '#F0EEF8', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#504E60' }}>{subtitle}</div>
    </div>
  )
}