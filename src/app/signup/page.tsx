'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [teamName, setTeamName] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        data: { team_name: teamName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        queryParams: {
          // Team name'i state olarak geç, confirm'de okuyacağız
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  if (done) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0C0C0E',
      }}>
        <div style={{
          maxWidth: 400,
          padding: '40px',
          background: '#111115',
          border: '1px solid #222228',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ color: '#F0EEF8', marginBottom: '8px', fontSize: '20px' }}>
            Check your email
          </h2>
          <p style={{ color: '#9896A8', fontSize: '14px', lineHeight: 1.6 }}>
            We sent a confirmation link to{' '}
            <strong style={{ color: '#F0EEF8' }}>{email}</strong>.
            Click the link to activate your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0C0C0E',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '40px',
        background: '#111115',
        border: '1px solid #222228',
        borderRadius: '16px',
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          color: '#F0EEF8',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Sior<span style={{ color: '#7B6EF6' }}>na</span>
        </h1>
        <p style={{ color: '#9896A8', fontSize: '14px', marginBottom: '32px' }}>
          Start your 14-day free trial
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          style={{
            width: '100%',
            padding: '11px',
            background: '#18181E',
            border: '1px solid #2A2A32',
            borderRadius: '8px',
            color: '#F0EEF8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            opacity: googleLoading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#222228' }} />
          <span style={{ fontSize: '12px', color: '#504E60' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#222228' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              color: '#9896A8',
              marginBottom: '6px',
            }}>
              Team name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Acme Inc."
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#18181E',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F0EEF8',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              color: '#9896A8',
              marginBottom: '6px',
            }}>
              Work email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#18181E',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F0EEF8',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              color: '#9896A8',
              marginBottom: '6px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#18181E',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F0EEF8',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{
              color: '#F26B6B',
              fontSize: '13px',
              marginBottom: '16px',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#7B6EF6',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Start free trial'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '13px',
          color: '#504E60',
        }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#7B6EF6', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>

        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '11px',
          color: '#3A3850',
          lineHeight: 1.6,
        }}>
          By signing up, you agree to our{' '}
          <a href="/terms" style={{ color: '#504E60', textDecoration: 'underline' }}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" style={{ color: '#504E60', textDecoration: 'underline' }}>
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  )
}