import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { question, lang } = await req.json()

  const systemPrompt = lang === 'tr'
    ? `Sen Phoebix'in AI astroloji asistanısın. Kullanıcıların astroloji sorularını yanıtlıyorsun. 
       Derin astroloji bilgisine sahipsin — doğum haritaları, gezegenler, evler, açılar, takımyıldızları.
       Yanıtların kısa (2-3 cümle), samimi ve mistik bir ton taşımalı. Türkçe yanıt ver.`
    : `You are Phoebix's AI astrology assistant. You answer users' astrology questions.
       You have deep knowledge of astrology — birth charts, planets, houses, aspects, constellations.
       Your answers should be brief (2-3 sentences), warm and carry a mystical tone. Answer in English.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  })

  const answer = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ answer })
}
