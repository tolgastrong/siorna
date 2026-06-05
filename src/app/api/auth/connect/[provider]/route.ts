import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Her provider için OAuth URL oluşturma ayarları
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider

  if (!OAUTH_CONFIG[provider]) {
    return NextResponse.json({ error: 'Geçersiz provider' }, { status: 400 })
  }

  // CSRF koruması için state oluştur
  const state = crypto.randomBytes(16).toString('hex')
  
  // State'i cookie'ye kaydet (callback'te doğrulayacağız)
  const response = NextResponse.redirect(buildAuthUrl(provider, state))
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 dakika
  })
  
  // Hangi üye bağlanıyor — URL'den al
  // Örn: /api/auth/connect/github?member_id=xxx
  const memberId = req.nextUrl.searchParams.get('member_id')
  if (memberId) {
    response.cookies.set('oauth_member_id', memberId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
    })
  }

  return response
}

function buildAuthUrl(provider: string, state: string): string {
  const config = OAUTH_CONFIG[provider]
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