'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import StarBg from '@/components/StarBg'

const clr = {
  border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
  purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff', nebula: '#0f0920',
}

const STARTERS_TR = [
  'Yükselen burcum ne anlama geliyor?',
  'Venüs burcum aşk hayatımı nasıl etkiliyor?',
  'Bu ay için kariyer tahminim nedir?',
  'Merkür retrosu beni nasıl etkiler?',
  'Doğum haritamı nasıl yorumlamalıyım?',
  'Hangi burçlarla uyumluyum?',
]

const STARTERS_EN = [
  'What does my rising sign mean?',
  'How does my Venus sign affect my love life?',
  'What is my career forecast for this month?',
  'How does Mercury retrograde affect me?',
  'How should I interpret my birth chart?',
  'Which signs am I most compatible with?',
]

interface Message { role: 'user' | 'ai'; text: string }

export default function AiYorum() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: lang === 'tr'
      ? 'Merhaba ✦ Ben Phoebix — kişisel AI astrologunuz. Doğum haritanız, burçlarınız veya gezegen enerjileri hakkında her şeyi sorabilirsiniz. Yıldızlar seninle konuşmaya hazır...'
      : 'Hello ✦ I am Phoebix — your personal AI astrologer. You can ask me anything about your birth chart, signs, or planetary energies. The stars are ready to speak with you...'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: lang === 'tr' ? 'Yıldızlar şu an sessiz... Lütfen tekrar dene.' : 'The stars are quiet now... Please try again.' }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const starters = lang === 'tr' ? STARTERS_TR : STARTERS_EN

  return (
    <>
      <StarBg />
      <div style={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', system-ui, sans-serif", color: clr.star }}>

        {/* NAV */}
        <nav style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', borderBottom: `0.5px solid ${clr.border}`, backdropFilter: 'blur(12px)', background: 'rgba(4,2,14,0.8)' }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: '0.25em', color: clr.purpleLight, textDecoration: 'none' }}>PHOEBIX</Link>
          <div style={{ display: 'flex', gap: 24 }}>
            {([[lang==='tr'?'Burçlar':'Signs','/burclar'],[lang==='tr'?'Harita':'Chart','/dogum-haritasi'],[lang==='tr'?'Uyumluluk':'Compatibility','/uyumluluk'],[lang==='tr'?'AI Yorum':'AI Reading','/ai-yorum']] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} style={{ fontSize: 13, color: h==='/ai-yorum' ? clr.purpleLight : clr.muted, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} style={{ fontSize: 11, padding: '5px 12px', border: `0.5px solid ${clr.border}`, borderRadius: 20, color: clr.muted, background: 'transparent', cursor: 'pointer' }}>{lang === 'tr' ? 'TR / EN' : 'EN / TR'}</button>
            <Link href="/giris" style={{ fontSize: 12, padding: '6px 16px', border: `0.5px solid rgba(123,94,168,0.4)`, borderRadius: 20, color: clr.purpleGlow, textDecoration: 'none' }}>{lang === 'tr' ? 'Giriş' : 'Login'}</Link>
          </div>
        </nav>

        {/* Chat header */}
        <div style={{ flexShrink: 0, padding: '16px 32px', borderBottom: `0.5px solid ${clr.border}`, background: 'rgba(15,9,32,0.5)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(123,94,168,0.3)', border: `1px solid ${clr.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: clr.purpleLight }}>
              {lang === 'tr' ? 'Phoebix AI — Kişisel Astrologun' : 'Phoebix AI — Your Personal Astrologer'}
            </div>
            <div style={{ fontSize: 11, color: clr.mutedDim, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#7aab88', animation: 'pulse 2s infinite' }} />
              {lang === 'tr' ? 'Çevrimiçi' : 'Online'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Starter questions (shown only when just the welcome message) */}
          {messages.length === 1 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 12 }}>
                {lang === 'tr' ? 'ÖRNEK SORULAR' : 'SUGGESTED QUESTIONS'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {starters.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding: '8px 14px', background: 'rgba(74,53,128,0.15)', border: `0.5px solid rgba(74,53,128,0.35)`,
                    borderRadius: 20, fontSize: 12.5, color: clr.muted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget).style.color = clr.purpleLight; (e.currentTarget).style.borderColor = 'rgba(123,94,168,0.6)' }}
                    onMouseLeave={e => { (e.currentTarget).style.color = clr.muted; (e.currentTarget).style.borderColor = 'rgba(74,53,128,0.35)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}>
              {m.role === 'ai' && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(123,94,168,0.25)', border: `0.5px solid ${clr.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginTop: 2 }}>✦</div>
              )}
              <div style={{
                maxWidth: '72%', padding: '13px 17px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? 'rgba(123,94,168,0.35)' : 'rgba(15,9,32,0.8)',
                border: `0.5px solid ${m.role === 'user' ? 'rgba(157,127,232,0.4)' : clr.border}`,
                fontSize: 14, lineHeight: 1.75,
                color: m.role === 'user' ? clr.purpleLight : clr.muted,
              }}>
                {m.role === 'ai' && <span style={{ color: 'rgba(157,127,232,0.5)', marginRight: 6, fontSize: 11 }}>✦</span>}
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(123,94,168,0.25)', border: `0.5px solid ${clr.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✦</div>
              <div style={{ padding: '13px 17px', background: 'rgba(15,9,32,0.8)', border: `0.5px solid ${clr.border}`, borderRadius: '18px 18px 18px 4px', fontSize: 14, color: clr.mutedDim, fontStyle: 'italic' }}>
                {lang === 'tr' ? 'Yıldızlar konuşuyor...' : 'The stars are speaking...'}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, padding: '16px 32px 24px', borderTop: `0.5px solid ${clr.border}`, background: 'rgba(4,2,14,0.8)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', gap: 10, maxWidth: 860, margin: '0 auto' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={lang === 'tr' ? 'Yıldızlara sor...' : 'Ask the stars...'}
              style={{ flex: 1, background: 'rgba(15,9,32,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 14, padding: '13px 18px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              padding: '13px 24px', background: loading || !input.trim() ? 'rgba(123,94,168,0.25)' : clr.purple,
              border: 'none', borderRadius: 14, color: clr.star, fontSize: 14, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s', flexShrink: 0,
            }}>
              {lang === 'tr' ? 'Sor' : 'Ask'}
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: clr.mutedDim, marginTop: 10 }}>
            {lang === 'tr' ? 'Phoebix AI astroloji bilgisi sunar, profesyonel danışmanlık yerine geçmez.' : 'Phoebix AI provides astrological insights, not professional advice.'}
          </p>
        </div>
      </div>
    </>
  )
}
