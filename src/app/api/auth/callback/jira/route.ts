import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const savedState = req.cookies.get('oauth_state')?.value

  if (!code || !state) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_params`
  )
}

  if (!state || state !== savedState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=invalid_state`)
  }

  const memberId = req.cookies.get('oauth_member_id')?.value

  try {
    // Code → token
    const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type:    'authorization_code',
        client_id:     process.env.JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/jira`,
      }),
    })
    const tokenData = await tokenRes.json()

    // Jira'nın cloud ID'sini al (her workspace'in benzersiz ID'si)
    const resourceRes = await fetch(
      'https://api.atlassian.com/oauth/token/accessible-resources',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )
    const resources = await resourceRes.json()
    const jiraCloud = resources[0] // ilk workspace

    // Kullanıcı bilgisi
    const userRes = await fetch(
      `https://api.atlassian.com/ex/jira/${jiraCloud.id}/rest/api/3/myself`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )
    const jiraUser = await userRes.json()

    await supabase.from('oauth_connections').upsert({
      team_member_id: memberId,
      team_id: await getTeamId(memberId!),
      provider: 'jira',
      access_token:  tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      provider_user_id:   jiraUser.accountId,
      provider_user_name: jiraUser.displayName,
      provider_metadata: {
        cloud_id: jiraCloud.id,
        domain:   jiraCloud.url,      // örn: https://acme.atlassian.net
        email:    jiraUser.emailAddress,
      },
      is_active: true,
    }, { onConflict: 'team_member_id,provider' })

    // jira alanlarını team_members'a yaz
    await supabase
      .from('team_members')
      .update({
        jira_account_id: jiraUser.accountId,
        jira_domain:     jiraCloud.url.replace('https://', ''),
        jira_email:      jiraUser.emailAddress,
      })
      .eq('id', memberId)

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?connected=jira`
    )
  } catch (err) {
    console.error('[jira callback]', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=jira_failed`)
  }
}

async function getTeamId(memberId: string) {
  const { data } = await supabase.from('team_members').select('team_id').eq('id', memberId).single()
  return data?.team_id
}