import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as 'email' | 'recovery' | null
  const code       = searchParams.get('code')  // Google OAuth code
  const next       = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Google OAuth — code ile exchange yap
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(
        new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL)
      )
    }
  }

  // Email doğrulama
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(
        new URL(next, process.env.NEXT_PUBLIC_APP_URL)
      )
    }
  }

  return NextResponse.redirect(
    new URL('/login?error=invalid_link', process.env.NEXT_PUBLIC_APP_URL)
  )
}