import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_params`
  )
}

  // CSRF doğrulama
  const savedState = req.cookies.get('oauth_state')?.value
  if (!state || state !== savedState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=invalid_state`)
  }

  const memberId = req.cookies.get('oauth_member_id')?.value

  try {
    // Code → access_token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      throw new Error(tokenData.error_description)
    }

    // GitHub kullanıcı bilgilerini çek
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const githubUser = await userRes.json()

    // DB'ye kaydet
    await supabase.from('oauth_connections').upsert({
      team_member_id: memberId,
      team_id: await getTeamId(memberId!),
      provider: 'github',
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      provider_user_id: String(githubUser.id),
      provider_user_name: githubUser.login,
      provider_metadata: {
        avatar_url: githubUser.avatar_url,
        name: githubUser.name,
      },
      is_active: true,
    }, { onConflict: 'team_member_id,provider' })

    // github_username'i team_members'a da yaz (raporlarda kullanıyoruz)
    await supabase
      .from('team_members')
      .update({ github_username: githubUser.login })
      .eq('id', memberId)

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?connected=github`
    )
  } catch (err) {
    console.error('[github callback]', err)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=github_failed`
    )
  }
}

async function getTeamId(memberId: string): Promise<string> {
  const { data } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('id', memberId)
    .single()
  return data?.team_id
}