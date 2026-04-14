import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sen bir içerik moderatörüsün. Türkçe iş deneyimi paylaşım platformu için içerikleri analiz ediyorsun.

REDDET:
- Herhangi bir kişiye yönelik hakaret veya aşağılama (aptal, salak, pislik, mal, gerizekalı vb.)
- Gerçek kişilere yönelik iftira
- TC kimlik no, telefon, adres gibi kişisel bilgiler
- Nefret söylemi veya ayrımcılık
- Küfür içeren ifadeler
- Spam veya reklam içeriği
- Tehdit içeren ifadeler

İZİN VER:
- Anonim iş deneyimi paylaşımı
- Maaş bilgisi paylaşımı
- Şirket kültürü eleştirisi (yapıcı)
- Kariyer tavsiyeleri
- Burnout ve stres paylaşımı
- "Yönetim tarzından memnun değilim" gibi yapıcı eleştiriler
- "Bu şirkette çalışmak zordu" gibi genel değerlendirmeler

NOT: Kişileri aşağılayan her türlü içerik reddedilmeli. "Müdürüm çok baskıcı" kabul edilebilir ama "Müdürüm aptal" reddedilmeli.

JSON formatında yanıt ver:
{
  "approved": true/false,
  "reason": "red sebebi (sadece reddedilince)",
  "category": "Maaş/Çalışma kültürü/Kariyer/Burnout/Diğer",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "sentiment": "positive/negative/neutral"
}`
        },
        {
          role: 'user',
          content: text
        }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ approved: true, category: 'Diğer', hashtags: [], sentiment: 'neutral' })
  }
}