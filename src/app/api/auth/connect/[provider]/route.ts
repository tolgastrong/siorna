import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const OAUTH_CONFIG: Record<string, {
  authUrl: string
  clientId: string
  scopes: string
  extra?: Record<string, string>
}> = {
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    clientId: process.env.GITHUB_CLIENT_ID!,
    scopes: 'read:user repo:status read:org',
  },
  linear: {
    authUrl: 'https://linear.app/oauth/authorize',
    clientId: process.env.LINEAR_CLIENT_ID!,
    scopes: 'read',
    extra: { response_type: 'code', actor: 'user' },
  },
  jira: {
    authUrl: 'https://auth.atlassian.com/authorize',
    clientId: process.env.JIRA_CLIENT_ID!,
    scopes: 'read:jira-work offline_access',
    extra: {
      audience: 'api.atlassian.com',
      prompt: 'consent',
      response_type: 'code',
    },
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    clientId: process.env.SLACK_CLIENT_ID!,
    scopes: 'chat:write,incoming-webhook,channels:read',
  },
  // Trello eklendi
  trello: {
    authUrl: 'https://trello.com/1/authorize',
    clientId: process.env.TRELLO_CLIENT_ID!,
    scopes: 'read,account',
  }
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ provider: string }> } // NEXT.JS 15 UYUMU BURADA
) {
  // Parantez içindeki değeri artık 'await' ile bekliyoruz
  const params = await props.params
  const provider = params.provider

  if (!OAUTH_CONFIG[provider]) {
    return NextResponse.json({ error: `Invalid provider: ${provider}` }, { status: 400 })
  }

  const state = crypto.randomBytes(16).toString('hex')
  const response = NextResponse.redirect(buildAuthUrl(provider, state))
  
  response.cookies.set('oauth_state', state, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 600
  })
  
  const memberId = req.nextUrl.searchParams.get('member_id')
  if (memberId) {
    response.cookies.set('oauth_member_id', memberId, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 600
    })
  }

  return response
}

function buildAuthUrl(provider: string, state: string): string {
  const config = OAUTH_CONFIG[provider]

  // Trello'nun kendine has eski bir yapısı vardır, redirect_uri yerine return_url kullanır
  // ve sonucu bize bir API'ye değil, doğrudan tarayıcıya yollar.
  if (provider === 'trello') {
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations/trello`
    const params = new URLSearchParams({
      key: config.clientId,
      return_url: returnUrl,
      scope: config.scopes,
      name: 'Siorna',
      expiration: 'never',
      response_type: 'fragment', // Token'ı URL hash'i olarak döndürür
    })
    return `${config.authUrl}?${params.toString()}`
  }

  // Diğer modern platformlar (GitHub, Linear, Jira, Slack)
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    scope: config.scopes,
    state,
    ...config.extra,
  })

  return `${config.authUrl}?${params.toString()}`
}