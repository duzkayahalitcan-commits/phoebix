'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import StarBg from '@/components/StarBg'
import { signs, dailyTexts, energyData } from '@/lib/data'

const clr = {
  bg: '#04020e', deep: '#0a0618', nebula: '#0f0920',
  border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
  purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff',
}

function DailyContent() {
  const params = useSearchParams()
  const slugFromUrl = params.get('sign')
  const initialIdx = slugFromUrl ? signs.findIndex(s => s.slug === slugFromUrl) : 0
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [selected, setSelected] = useState(Math.max(0, initialIdx))
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const s = signs[selected]

  useEffect(() => {
    if (slugFromUrl) {
      const idx = signs.findIndex(x => x.slug === slugFromUrl)
      if (idx >= 0) setSelected(idx)
    }
  }, [slugFromUrl])

  const getAiReading = async () => {
    setAiLoading(true); setAiText('')
    const question = lang === 'tr'
      ? `${s.tr} burcu için bugünkü detaylı astroloji yorumunu yaz. Aşk, kariyer ve kişisel gelişim hakkında içgörüler ver.`
      : `Write a detailed daily astrology reading for ${s.en}. Give insights on love, career and personal growth.`
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, lang }) })
      const data = await res.json()
      setAiText(data.answer)
    } catch { setAiText(lang === 'tr' ? 'Yıldızlar şu an sessiz...' : 'The stars are quiet now...') }
    setAiLoading(false)
  }

  const energy = energyData[selected]
  const energyLabels = lang === 'tr' ? ['Aşk', 'Kariyer', 'Sağlık', 'Şans'] : ['Love', 'Career', 'Health', 'Luck']
  const energyColors = ['#c97c6a', '#9d7fe8', '#7aab88', '#c9a96a']

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", color: clr.star }}>
      <StarBg />

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `0.5px solid ${clr.border}`, backdropFilter: 'blur(12px)', background: 'rgba(4,2,14,0.75)' }}>
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: '0.25em', color: clr.purpleLight, textDecoration: 'none' }}>PHOEBIX</Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Burçlar','/burclar'],['Harita','/dogum-haritasi'],['Uyumluluk','/uyumluluk'],['AI Yorum','/ai-yorum']].map(([l,h]) => (
            <Link key={h} href={h} style={{ fontSize: 13, color: clr.muted, textDecoration: 'none' }}>{lang==='en' ? {'/burclar':'Signs','/dogum-haritasi':'Chart','/uyumluluk':'Compatibility','/ai-yorum':'AI Reading'}[h] : l}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} style={{ fontSize: 11, padding: '5px 12px', border: `0.5px solid ${clr.border}`, borderRadius: 20, color: clr.muted, background: 'transparent', cursor: 'pointer' }}>{lang === 'tr' ? 'TR / EN' : 'EN / TR'}</button>
          <Link href="/giris" style={{ fontSize: 12, padding: '6px 16px', border: `0.5px solid rgba(123,94,168,0.4)`, borderRadius: 20, color: clr.purpleGlow, textDecoration: 'none' }}>{lang === 'tr' ? 'Giriş' : 'Login'}</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: clr.mutedDim, marginBottom: 14 }}>✦ ✦ ✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: clr.star, marginBottom: 10 }}>
            {lang === 'tr' ? 'Günlük Yorum' : 'Daily Reading'}
          </h1>
          <p style={{ color: clr.muted, fontSize: 14 }}>
            {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
          </p>
        </div>

        {/* Sign grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: 10, marginBottom: 40 }}>
          {signs.map((s, i) => (
            <button key={s.slug} onClick={() => setSelected(i)} style={{
              padding: '14px 8px', borderRadius: 14, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: 'none',
              background: selected === i ? `${s.color}30` : 'rgba(15,9,32,0.6)',
              outline: selected === i ? `1px solid ${s.color}80` : '1px solid rgba(74,53,128,0.25)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 5, color: selected === i ? s.color : clr.muted }}>{s.symbol}</div>
              <div style={{ fontSize: 11, color: selected === i ? clr.purpleLight : clr.muted, fontWeight: selected === i ? 500 : 400 }}>
                {lang === 'tr' ? s.tr : s.en}
              </div>
            </button>
          ))}
        </div>

        {/* Selected sign detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Main reading card */}
          <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '28px 28px', backdropFilter: 'blur(12px)', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: `${s.color}20`, border: `1px solid ${s.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{s.symbol}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: clr.purpleLight, fontWeight: 400 }}>
                  {lang === 'tr' ? s.tr : s.en}
                </div>
                <div style={{ fontSize: 12, color: clr.mutedDim, marginTop: 2 }}>{s.dates} · {s.planet}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 12px', background: `${s.color}18`, border: `0.5px solid ${s.color}50`, borderRadius: 12, color: s.color }}>{lang === 'tr' ? 'Bugün' : 'Today'}</div>
            </div>
            <p style={{ fontSize: 15, color: clr.muted, lineHeight: 1.85, marginBottom: 24 }}>
              {dailyTexts[lang][selected]}
            </p>

            {/* Energy bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {energyLabels.map((label, i) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: clr.mutedDim }}>{label}</span>
                    <span style={{ fontSize: 11, color: energyColors[i], fontWeight: 500 }}>{energy[i]}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(42,31,74,0.5)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${energy[i]}%`, background: energyColors[i], borderRadius: 2, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky card */}
          <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '24px', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 18 }}>
              {lang === 'tr' ? 'BUGÜNÜN ŞANSLILARI' : "TODAY'S LUCKY"}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '🎨', label: lang === 'tr' ? 'Şanslı Renk' : 'Lucky Color', val: s.luckyColor },
                { icon: '🔢', label: lang === 'tr' ? 'Şanslı Sayı' : 'Lucky Number', val: String(s.luckyNum) },
                { icon: '💎', label: lang === 'tr' ? 'Şanslı Taş' : 'Lucky Stone', val: s.luckyStone },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(74,53,128,0.12)', borderRadius: 12, border: `0.5px solid rgba(74,53,128,0.2)` }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: clr.mutedDim, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, color: clr.purpleLight, fontWeight: 500 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI reading card */}
          <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '24px', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 18 }}>
              {lang === 'tr' ? 'KİŞİSEL AI YORUMU' : 'PERSONALIZED AI READING'}
            </div>
            {!aiText && !aiLoading && (
              <>
                <p style={{ fontSize: 13, color: clr.muted, lineHeight: 1.7, marginBottom: 18 }}>
                  {lang === 'tr'
                    ? 'Phoebix AI sana bugün için özel, derinlemesine bir astroloji yorumu hazırlasın.'
                    : 'Let Phoebix AI prepare a personalized, in-depth astrology reading for you today.'}
                </p>
                <button onClick={getAiReading} style={{ width: '100%', padding: '12px', background: clr.purple, border: 'none', borderRadius: 12, color: clr.star, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  ✦ {lang === 'tr' ? 'AI Yorumu Al' : 'Get AI Reading'}
                </button>
              </>
            )}
            {aiLoading && (
              <div style={{ fontSize: 13, color: clr.mutedDim, fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                {lang === 'tr' ? 'Yıldızlar konuşuyor...' : 'The stars are speaking...'}
              </div>
            )}
            {aiText && (
              <>
                <p style={{ fontSize: 13, color: clr.muted, lineHeight: 1.8 }}>{aiText}</p>
                <button onClick={() => { setAiText(''); }} style={{ marginTop: 14, fontSize: 12, color: clr.mutedDim, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  {lang === 'tr' ? 'Yenile' : 'Refresh'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Browse all link */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/burclar" style={{ fontSize: 13, color: clr.mutedDim, textDecoration: 'underline' }}>
            {lang === 'tr' ? 'Tüm burçları gör →' : 'Browse all signs →'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function GunlukYorum() {
  return (
    <Suspense>
      <DailyContent />
    </Suspense>
  )
}
