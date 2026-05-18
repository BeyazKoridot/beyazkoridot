import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// Kişisel email domainleri — iş emaili sayılmaz
const FREE_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
  'icloud.com', 'me.com', 'live.com', 'yandex.com',
  'protonmail.com', 'mail.com', 'inbox.com', 'yandex.ru'
]

export async function POST(req: NextRequest) {
  const { userId, workEmail } = await req.json()

  if (!userId || !workEmail) {
    return NextResponse.json({ error: 'userId ve workEmail zorunlu' }, { status: 400 })
  }

  // Email format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(workEmail)) {
    return NextResponse.json({ error: 'Geçersiz email formatı' }, { status: 400 })
  }

  // Kişisel domain kontrolü
  const domain = workEmail.split('@')[1]?.toLowerCase()
  if (FREE_DOMAINS.includes(domain)) {
    return NextResponse.json({
      error: 'Lütfen kurumsal iş e-postanızı girin (gmail, hotmail gibi kişisel adresler kabul edilmez)'
    }, { status: 400 })
  }

  // Token üret (6 haneli kod)
  const token = randomBytes(3).toString('hex').toUpperCase() // 6 karakter hex
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 dakika

  // DB'ye kaydet
  const { error: dbError } = await supabase
    .from('profiles')
    .update({
      work_email: workEmail,
      work_email_verified: false,
      work_email_token: token,
      work_email_token_expires_at: expiresAt.toISOString(),
    })
    .eq('id', userId)

  if (dbError) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 })
  }

  // Email gönder
  const { error: emailError } = await resend.emails.send({
    from: 'OTR Social <dogrulama@otrsocial.com>',
    to: workEmail,
    subject: 'İş e-postanızı doğrulayın — OTR Social',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
          <div style="width: 28px; height: 28px; background: #1a1a1a; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 9px; font-weight: 700;">OTR</span>
          </div>
          <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">Off The Record Social</span>
        </div>

        <h1 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">İş e-postanızı doğrulayın</h1>
        <p style="font-size: 14px; color: #666; margin: 0 0 24px; line-height: 1.6;">
          Aşağıdaki kodu OTR Social profilinize girin. Kod <strong>30 dakika</strong> geçerli.
        </p>

        <div style="background: #f4f4f4; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; margin: 0; font-family: monospace;">${token}</p>
        </div>

        <p style="font-size: 12px; color: #999; margin: 0; line-height: 1.6;">
          Bu e-postayı siz istemediyseniz dikkate almayın. Hiçbir işlem yapılmayacaktır.<br>
          OTR Social · <a href="https://otrsocial.com" style="color: #999;">otrsocial.com</a>
        </p>
      </div>
    `,
  })

  if (emailError) {
    console.error('Email gönderme hatası:', emailError)
    return NextResponse.json({ error: 'Email gönderilemedi, lütfen tekrar dene' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
