import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { userId, token } = await req.json()

  if (!userId || !token) {
    return NextResponse.json({ error: 'userId ve token zorunlu' }, { status: 400 })
  }

  // Profile'ı getir
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('work_email_token, work_email_token_expires_at, work_email')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return NextResponse.json({ error: 'Profil bulunamadı' }, { status: 404 })
  }

  // Token eşleşiyor mu?
  if (profile.work_email_token !== token.toUpperCase().trim()) {
    return NextResponse.json({ error: 'Hatalı kod. Tekrar dene.' }, { status: 400 })
  }

  // Token süresi dolmuş mu?
  if (!profile.work_email_token_expires_at || new Date(profile.work_email_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Kodun süresi dolmuş. Yeni kod gönder.' }, { status: 400 })
  }

  // Doğrula
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      work_email_verified: true,
      work_email_token: null,
      work_email_token_expires_at: null,
    })
    .eq('id', userId)

  if (updateError) {
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }

  return NextResponse.json({ success: true, workEmail: profile.work_email })
}
