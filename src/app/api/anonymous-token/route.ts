import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // 1. Auth kontrolü — kullanıcı login mi?
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Anonim post atmak için giriş yapmalısın' },
      { status: 401 }
    )
  }

  // 2. Secret kontrolü
  const SECRET = process.env.ANONYMOUS_HMAC_SECRET
  if (!SECRET) {
    console.error('ANONYMOUS_HMAC_SECRET environment variable yok')
    return NextResponse.json(
      { error: 'Sunucu yapılandırma hatası' },
      { status: 500 }
    )
  }

  // 3. Bugünün tarihini al (UTC, gün bazında)
  // Aynı kullanıcı aynı gün aynı token alacak — bu rate limiting'in temeli
  const today = new Date().toISOString().slice(0, 10) // "2026-05-07" gibi

  // 4. HMAC token üret
  // HMAC(secret, user_id + ":" + tarih) → geri çevrilemez 64 karakterlik string
  const tokenPayload = `${user.id}:${today}`
  const rateToken = createHmac('sha256', SECRET).update(tokenPayload).digest('hex')

  // 5. Expires_at hesapla — 30 gün sonra
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // 6. Frontend'e dön
  return NextResponse.json({
    rate_token: rateToken,
    rate_token_expires_at: expiresAt.toISOString(),
  })
}
