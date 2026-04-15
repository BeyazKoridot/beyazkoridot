import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  const YASAKLI_KELIMELER = ['aptal', 'salak', 'pislik', 'gerizekalı', 'mal', 'göt', 'orospu', 'siktir', 'amk', 'bok', 'sürtük', 'kahpe', 'öldür', 'öldüreceğim', 'gebereceğim', 'keriz', 'dangalak', 'nobran', 'hırsız', 'dolandırıcı']
  
  const metinKucuk = text.toLowerCase()
  const yasakliKelimeBulundu = YASAKLI_KELIMELER.some(kelime => metinKucuk.includes(kelime))
  
  if (yasakliKelimeBulundu) {
    return NextResponse.json({
      approved: false,
      reason: 'İçeriğiniz hakaret veya uygunsuz ifadeler içeriyor. Lütfen yapıcı bir dil kullanın.',
      category: 'Diğer',
      hashtags: [],
      sentiment: 'negative'
    })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sen bir içerik moderatörüsün. Türkçe iş deneyimi paylaşım platformu için içerikleri analiz ediyorsun.

KESINLIKLE REDDET:
- Kişilere hakaret veya aşağılama
- Gerçek kişilere iftira (isim + suçlama)
- Tehdit içeren ifadeler
- Küfür veya argo
- Kişisel bilgiler (TC, telefon, adres)
- Nefret söylemi

İZİN VER:
- İş deneyimi paylaşımı
- Maaş bilgisi
- Yapıcı eleştiri
- Kariyer tavsiyeleri
- Burnout paylaşımı

JSON formatında yanıt ver:
{
  "approved": true/false,
  "reason": "red sebebi",
  "category": "Maaş/Çalışma kültürü/Kariyer/Burnout/Diğer",
  "hashtags": ["#hashtag1"],
  "sentiment": "positive/negative/neutral"
}`
        },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Moderasyon hatası:', error?.message, error?.status, error?.code)
    return NextResponse.json({ 
      approved: false, 
      reason: error?.message ?? 'Moderasyon servisi kullanılamıyor'
    })
  }
}
