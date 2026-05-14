import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { userId, otp } = await req.json()

  if (!userId || !otp) {
    return NextResponse.json({ error: 'userId ve kod zorunlu' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('work_email_token, work_email_token_expires_at')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return NextResponse.json({ error: 'Profil bulunamadı' }, { status: 404 })
  }

  if (!profile.work_email_token) {
    return NextResponse.json({ error: 'Önce doğrulama kodu isteyin' }, { status: 400 })
  }

  if (new Date(profile.work_email_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Kod süresi dolmuş. Lütfen yeni kod isteyin.' }, { status: 400 })
  }

  if (profile.work_email_token !== otp.trim()) {
    return NextResponse.json({ error: 'Kod hatalı. Lütfen tekrar kontrol edin.' }, { status: 400 })
  }

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

  return NextResponse.json({ ok: true })
}
