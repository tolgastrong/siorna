import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  // Önce null kontrolü yap
  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_params`
    )
  }

  const savedState = req.cookies.get('oauth_state')?.value
  if (state !== savedState) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=invalid_state`
    )
  }

  try {
    const tokenRes = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,           // artık kesinlikle string, null değil
        redirect_uri:  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/slack`,
      }),
    })

    const slackData = await tokenRes.json()

    if (!slackData.ok) {
      throw new Error(slackData.error)
    }

    const teamId   = req.cookies.get('oauth_team_id')?.value
    const memberId = req.cookies.get('oauth_member_id')?.value

    await supabase
      .from('teams')
      .update({ slack_webhook: slackData.incoming_webhook.url })
      .eq('id', teamId)

    await supabase.from('oauth_connections').upsert({
      team_id:            teamId,
      team_member_id:     memberId,
      provider:           'slack',
      access_token:       slackData.access_token,
      provider_user_id:   slackData.team.id,
      provider_user_name: slackData.team.name,
      provider_metadata: {
        webhook_url:    slackData.incoming_webhook.url,
        channel:        slackData.incoming_webhook.channel,
        channel_id:     slackData.incoming_webhook.channel_id,
        workspace_id:   slackData.team.id,
        workspace_name: slackData.team.name,
      },
      is_active: true,
    }, { onConflict: 'team_member_id,provider' })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?connected=slack`
    )
  } catch (err) {
    console.error('[slack callback]', err)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=slack_failed`
    )
  }
}