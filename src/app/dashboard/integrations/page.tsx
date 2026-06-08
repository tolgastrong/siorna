import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// ─── Orijinal Marka Logoları (Çok Renkli SVG Vektörleri) ───
const LOGOS = {
  github: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.379.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  linear: (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-6.04-4.839l6.398-6.399-1.28-1.279-7.14 7.14a8.03 8.03 0 002.022.538zm2.597 1.838l8.368-8.367-1.28-1.28-9.055 9.056a8.03 8.03 0 001.967.591zm2.57 1.055l10.334-10.334-1.28-1.28-10.871 10.872a8.03 8.03 0 001.817.742z"/>
    </svg>
  ),
  jira: (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.53 11.83c-.2-.2-.53-.31-.81-.31H.74c-.87 0-1.31 1.05-.69 1.67L9.5 22.63c.38.38 1 .38 1.38 0l.65-.65V11.83z" fill="#2684FF"/>
      <path d="M17.43 5.92c-.2-.2-.53-.31-.81-.31H6.64c-.87 0-1.31 1.05-.69 1.67l9.45 9.44c.38.38 1 .38 1.38 0l.65-.65V5.92z" fill="#0052CC"/>
      <path d="M23.33 0c-.2-.2-.53-.31-.81-.31h-9.98c-.87 0-1.31 1.05-.69 1.67l9.45 9.44c.38.38 1 .38 1.38 0l.65-.65V0z" fill="#0052CC"/>
    </svg>
  ),
  trello: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#0079BF">
      <path d="M20.53 1.946h-17.06c-1.077 0-1.954.877-1.954 1.954v17.06c0 1.077.877 1.954 1.954 1.954h17.06c1.077 0 1.954-.877 1.954-1.954v-17.06c0-1.077-.877-1.954-1.954-1.954zm-9.726 14.65c0 .546-.445.991-.992.991h-3.966c-.546 0-.991-.445-.991-.991v-9.921c0-.546.445-.992.991-.992h3.966c.547 0 .992.446.992.992v9.92zm7.935-4.96c0 .546-.445.992-.991.992h-3.966c-.546 0-.992-.446-.992-.992v-4.96c0-.546.446-.992.992-.992h3.966c.546 0 .991.446.991.992v4.96z"/>
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52z" fill="#E01E5A"/>
      <path d="M6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834z" fill="#36C5F0"/>
      <path d="M8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.835a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.835a2.528 2.528 0 01-2.522 2.521h-2.522V8.835z" fill="#2EB67D"/>
      <path d="M17.688 8.835a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.313z" fill="#2EB67D"/>
      <path d="M15.165 18.958a2.527 2.527 0 012.523 2.52 2.528 2.528 0 01-2.523 2.522 2.528 2.528 0 01-2.52-2.522v-2.52h2.52z" fill="#ECB22E"/>
      <path d="M15.165 17.687a2.528 2.528 0 01-2.52-2.521 2.527 2.527 0 012.52-2.521h6.313A2.527 2.527 0 0124 15.166a2.528 2.528 0 01-2.522 2.521h-6.313z" fill="#ECB22E"/>
    </svg>
  )
}

// ─── Araçlar Listesi ───
const TOOLS = [
  { id: 'github', name: 'GitHub', icon: LOGOS.github, desc: 'Connect repositories to track commits and pull requests autonomously.', color: '#F0EEF8', status: 'essential' },
  { id: 'linear', name: 'Linear', icon: LOGOS.linear, desc: 'Sync workspace cycles and issue progress in real-time.', color: '#F0EEF8', status: 'popular' },
  { id: 'jira', name: 'Jira', icon: LOGOS.jira, desc: 'Monitor enterprise sprints and ticket transitions.', color: '#0052CC', status: 'enterprise' },
  { id: 'trello', name: 'Trello', icon: LOGOS.trello, desc: 'Read board movements and card completions.', color: '#0079BF', status: 'standard' },
  { id: 'slack', name: 'Slack', icon: LOGOS.slack, desc: 'Select channels to deliver automated engineering reports.', color: '#E01E5A', status: 'delivery' }
]

export default async function IntegrationsPage() {
  const supabase = await createClient()

  // 1. Kullanıcıyı doğruluyoruz
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 2. Kullanıcıyı Siorna veritabanında arıyoruz
  let { data: member } = await supabase
    .from('team_members')
    .select('id, team_id') // Hem id hem team_id seçiyoruz
    .eq('email', user.email)
    .single()

  // 3. OTONOM KAYIT: Eğer ilk defa giriyorsa Takım ve Üye profili oluştur
  if (!member) {
    const { data: newTeam } = await supabase.from('teams').insert({
      name: user.user_metadata?.team_name || 'My Workspace'
    }).select('id').single()

    if (newTeam) {
      const { data: newMember } = await supabase.from('team_members').insert({
        team_id: newTeam.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: 'lead'
      }).select('id, team_id').single()
      
      member = newMember
    }
  }

  const memberId = member?.id

  // 4. Mevcut entegrasyonları veritabanından çekiyoruz
  const { data: connections } = await supabase
    .from('oauth_connections')
    .select('provider') as { data: { provider: string }[] | null }

  const connectedSet = new Set(connections?.map((c) => c.provider) ?? [])

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '-0.03em', color: '#F0EEF8' }}>
          Integrations
        </h1>
        <p style={{ color: '#9896A8', fontSize: 15, margin: 0, lineHeight: 1.6, maxWidth: 600 }}>
          Connect your engineering stack to start generating autonomous reports. Siorna requires only metadata access and never reads your source code.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {TOOLS.map((tool) => {
          const isConnected = connectedSet.has(tool.id)

          return (
            <div key={tool.id} style={{
              background: '#111115',
              border: `1px solid ${isConnected ? 'rgba(61,214,140,0.3)' : '#222228'}`,
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
            }}>
              {isConnected && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #3DD68C80, transparent)' }} />}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: isConnected ? `${tool.color}15` : '#18181E',
                  border: `1px solid ${isConnected ? `${tool.color}30` : '#2A2A32'}`,
                  color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {tool.icon}
                </div>
                
                <div style={{
                  fontSize: 10, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '4px 8px', borderRadius: 6,
                  background: isConnected ? 'rgba(61,214,140,0.1)' : '#18181E',
                  color: isConnected ? '#3DD68C' : '#504E60',
                  border: `1px solid ${isConnected ? 'rgba(61,214,140,0.2)' : '#2A2A32'}`,
                }}>
                  {isConnected ? 'Connected' : tool.status}
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F0EEF8', margin: '0 0 6px 0' }}>{tool.name}</h3>
              <p style={{ fontSize: 13, color: '#9896A8', margin: '0 0 24px 0', lineHeight: 1.5, flex: 1 }}>{tool.desc}</p>

              {isConnected ? (
                <Link href={`/dashboard/integrations/${tool.id}`} style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '10px',
                  background: 'transparent', border: '1px solid #2A2A32', borderRadius: 8,
                  color: '#F0EEF8', fontSize: 13, fontWeight: 500, textDecoration: 'none'
                }}>
                  Manage Settings
                </Link>
              ) : (
                <Link href={`/api/auth/connect/${tool.id}?member_id=${memberId}`} style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '10px',
                  background: '#F0EEF8', border: 'none', borderRadius: 8,
                  color: '#0C0C0E', fontSize: 13, fontWeight: 600, textDecoration: 'none'
                }}>
                  Connect {tool.name}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}