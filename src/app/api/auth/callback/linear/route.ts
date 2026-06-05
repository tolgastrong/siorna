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
    const tokenRes = await fetch('https://api.linear.app/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.LINEAR_CLIENT_ID!,
        client_secret: process.env.LINEAR_CLIENT_SECRET!,
        redirect_uri:  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linear`,
        code:          code!,
        grant_type:    'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    // Linear kullanıcı bilgisi
    const userRes = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: '{ viewer { id name email } }' }),
    })
    const userData = await userRes.json()
    const viewer = userData.data.viewer

    await supabase.from('oauth_connections').upsert({
      team_member_id: memberId,
      team_id: await getTeamId(memberId!),
      provider: 'linear',
      access_token: tokenData.access_token,
      provider_user_id: viewer.id,
      provider_user_name: viewer.name,
      provider_metadata: { email: viewer.email },
      is_active: true,
    }, { onConflict: 'team_member_id,provider' })

    // linear_user_id'yi team_members'a yaz
    await supabase
      .from('team_members')
      .update({ linear_user_id: viewer.id })
      .eq('id', memberId)

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?connected=linear`
    )
  } catch (err) {
    console.error('[linear callback]', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=linear_failed`)
  }
}

async function getTeamId(memberId: string) {
  const { data } = await supabase.from('team_members').select('team_id').eq('id', memberId).single()
  return data?.team_id
}