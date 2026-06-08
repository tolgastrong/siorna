'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrelloCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Verifying Trello connection...')

  useEffect(() => {
    // 1. Trello'dan dönen hash token'ı tarayıcıdan yakala
    const hash = window.location.hash
    if (!hash || !hash.includes('token=')) {
      router.push('/dashboard/integrations?error=trello_no_token')
      return
    }

    const token = hash.replace('#token=', '')

    // 2. Token'ı güvenli bir şekilde sunucumuza kaydetmeye gönder
    async function saveTrelloToken() {
      try {
        const res = await fetch('/api/auth/callback/trello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (!res.ok) throw new Error('Failed to save token')
        
        // 3. Başarılıysa entegrasyonlar sayfasına geri yolla
        router.push('/dashboard/integrations?connected=trello')
      } catch (err) {
        console.error(err)
        router.push('/dashboard/integrations?error=trello_save_failed')
      }
    }

    saveTrelloToken()
  }, [router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#9896A8' }}>
      <p>🔌 {status}</p>
    </div>
  )
}