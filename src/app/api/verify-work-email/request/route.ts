import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.com.tr', 'outlook.com',
  'live.com', 'msn.com', 'yahoo.com', 'yahoo.com.tr', 'ymail.com',
  'icloud.com', 'me.com', 'mac.com', 'protonmail.com', 'proton.me',
  'yandex.com', 'yandex.ru', 'mail.com', 'mail.ru', 'inbox.com',
])

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const { userId, workEmail } = await req.json()

  if (!userId || !workEmail) {
    return NextResponse.json({ error: 'userId ve workEmail zorunlu' }, { status: 400 })
  }

  const domain = workEmail.split('@')[1]?.toLowerCase()
  if (!domain) {
    return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
  }
  if (FREE_DOMAINS.has(domain)) {
    return NextResponse.json({ error: 'Lütfen kurumsal e-posta adresinizi kullanın (Gmail, Hotmail vb. kabul edilmez)' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { error: dbError } = await supabase
    .from('profiles')
    .update({
      work_email: workEmail,
      work_email_token: otp,
      work_email_token_expires_at: expiresAt,
    })
    .eq('id', userId)

  if (dbError) {
    console.error('DB error:', dbError)
    return NextResponse.json({ error: 'Veritabanı hatası oluştu' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    await resend.emails.send({
      from: 'OTR Social <onboarding@resend.dev>',
      to: workEmail,
      subject: 'İş e-postanızı doğrulayın — OTR Social',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <span style="background: #1a1a1a; color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.05em;">OTR SOCIAL</span>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 8px;">İş e-postanızı doğrulayın</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Doğrulanmış rozeti almak için aşağıdaki kodu OTR Social profilinize girin.
          </p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 0.15em; color: #1a1a1a;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 12px; margin: 0;">
            Bu kod 10 dakika geçerlidir. Bu işlemi siz başlatmadıysanız bu e-postayı görmezden gelebilirsiniz.
          </p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Email error:', emailError)
    return NextResponse.json({ error: 'E-posta gönderilemedi. Lütfen tekrar deneyin.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
