'use client'
import { useState } from 'react'

interface AISectionProps { lang: 'tr' | 'en' }

export default function AISection({ lang }: AISectionProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: lang === 'tr'
        ? "Venüs'ün şu anki pozisyonu ilişkilerinde yeni bir kapı aralıyor. Yükselen burcunun etkisiyle bu enerjiyi iletişimde kullanabilirsin..."
        : "Venus's current position is opening a new door in your relationships. Channel this energy into communication with your rising sign's influence...",
    },
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: lang === 'tr' ? 'Yıldızlar şu an sessiz... Biraz sonra tekrar dene.' : 'The stars are quiet now... Try again in a moment.'
      }])
    }
    setLoading(false)
  }

  const placeholder = lang === 'tr' ? 'Doğum haritam hakkında soru sor...' : 'Ask about your birth chart...'
  const label = lang === 'tr' ? 'AI ASTROLOJİ ASISTANIN' : 'YOUR AI ASTROLOGY ASSISTANT'
  const title = lang === 'tr' ? 'Phoebix AI — Kişisel Astrologun' : 'Phoebix AI — Your Personal Astrologer'
  const sendBtn = lang === 'tr' ? 'Sor' : 'Ask'

  return (
    <section className="relative z-10 px-6 md:px-10 py-12 border-b border-purple-dim/30 bg-void/50">
      <p className="text-xs tracking-[0.25em] text-muted/60 mb-6">{label}</p>
      <div className="card-dark rounded-2xl p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 rounded-full bg-purple-glow animate-pulse" />
          <span className="text-sm font-medium text-purple-light">{title}</span>
        </div>
        <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`text-sm leading-relaxed ${
              m.role === 'ai' ? 'text-muted' : 'text-purple-light text-right'
            }`}>
              {m.role === 'ai' && (
                <span className="text-purple-glow/60 text-xs mr-2">✦</span>
              )}
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-muted/50 italic">
              {lang === 'tr' ? 'Yıldızlar konuşuyor...' : 'The stars are speaking...'}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={placeholder}
            className="flex-1 bg-void/80 border border-purple-dim/40 rounded-xl px-4 py-2.5 text-sm text-muted placeholder-muted/40 focus:outline-none focus:border-purple-bright/40"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-purple-bright/80 hover:bg-purple-bright disabled:opacity-40 text-star text-sm rounded-xl transition-all"
          >
            {sendBtn}
          </button>
        </div>
      </div>
    </section>
  )
}
