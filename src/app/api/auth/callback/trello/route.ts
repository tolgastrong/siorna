import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    const memberId = req.cookies.get('oauth_member_id')?.value

    if (!token || !memberId) {
      return NextResponse.json({ error: 'Missing token or member ID' }, { status: 400 })
    }

    // Trello'dan kullanıcının gerçek ismini ve ID'sini çekelim
    const userRes = await fetch(`https://api.trello.com/1/members/me?key=${process.env.TRELLO_CLIENT_ID}&token=${token}`)
    const trelloUser = await userRes.json()

    // Siorna üyesinin Hangi Takımda olduğunu bulalım
    const { data: member } = await supabase.from('team_members').select('team_id').eq('id', memberId).single()

    // Veritabanına kaydedelim
    await supabase.from('oauth_connections').upsert({
      team_member_id: memberId,
      team_id: member?.team_id,
      provider: 'trello',
      access_token: token,
      provider_user_id: trelloUser.id,
      provider_user_name: trelloUser.fullName,
      is_active: true,
    }, { onConflict: 'team_member_id,provider' })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[trello api error]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}