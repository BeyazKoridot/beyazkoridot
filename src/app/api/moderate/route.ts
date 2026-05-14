import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  const YASAKLI_KELIMELER = [
    // Hakaretler
    'aptal', 'salak', 'gerizekalı', 'keriz', 'dangalak', 'nobran', 'ahmak', 'budala', 'geri zekalı',
    'mankafa', 'eşek', 'öküz', 'hayvan', 'it', 'köpek', 'domuz',
    // Ağır küfürler
    'orospu', 'siktir', 'amk', 'amına', 'göt', 'götveren', 'bok', 'boktan',
    'sürtük', 'kahpe', 'kaltak', 'orospuçocuğu', 'piç',
    // Pis söylemler
    'pislik', 'şerefsiz', 'namussuz', 'alçak', 'rezil', 'haysiyetsiz',
    // Tehdit ifadeleri
    'öldür', 'öldüreceğim', 'gebereceğim', 'geberteceğim', 'kanını dökeceğim',
    'bedelini ödersin', 'pişman ederim', 'canını yakarım',
    // Doxxing tetikleyiciler (bağlamla değerlendirilecek)
    'tc kimlik', 'kimlik numarası',
  ]
  
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

KESINLIKLE REDDET (bunlar olmadıkça onayla):
- Kişi adı + ağır suçlama kombinasyonu (iftira)
- Açık tehdit ifadeleri (öldüreceğim, zarar vereceğim)
- Küfür veya argo
- Kişisel bilgiler (TC, telefon, adres)
- Nefret söylemi (ırk, din, cinsiyet ayrımcılığı)

MUTLAKA İZİN VER:
- İş deneyimi ve mülakat deneyimi paylaşımı
- Ayrımcı işveren davranışı anlatımı (hamilelik sorusu, medeni durum sorusu vb.)
- Maaş bilgisi
- Şirket veya sektör eleştirisi
- Kariyer tavsiyeleri
- Burnout ve stres paylaşımı
- Hayal kırıklığı, öfke veya hayal kırıklığı ifadesi (hakaret olmadan)

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
