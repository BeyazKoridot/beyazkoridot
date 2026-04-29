import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { ad, email, konu, mesaj } = await request.json()
  try {
    await resend.emails.send({
      from: 'OTR Social <onboarding@resend.dev>',
      to: 'info@otrsocial.com',
      subject: `İletişim: ${konu || 'Yeni mesaj'}`,
      html: `<p><b>Ad:</b> ${ad}</p><p><b>E-posta:</b> ${email}</p><p><b>Konu:</b> ${konu}</p><p><b>Mesaj:</b><br/>${mesaj}</p>`,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
