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
  const today = new Date().toISOString().slice(0, 10)

  // 4. HMAC token üret — aynı kullanıcı aynı gün aynı token alır
  const tokenPayload = `${user.id}:${today}`
  const rateToken = createHmac('sha256', SECRET).update(tokenPayload).digest('hex')

  // 5. Rate limit kontrolü: günde max 5 anonim post
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('rate_token', rateToken)

  if ((count ?? 0) >= 5) {
    return NextResponse.json(
      { error: 'Günlük anonim post limitine ulaştın (5/5). Yarın tekrar deneyebilirsin.' },
      { status: 429 }
    )
  }

  // 6. Expires_at hesapla — 30 gün sonra
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // 7. Frontend'e dön
  return NextResponse.json({
    rate_token: rateToken,
    rate_token_expires_at: expiresAt.toISOString(),
  })
}
