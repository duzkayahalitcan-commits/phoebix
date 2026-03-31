'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarBg from '@/components/StarBg'
import { signs, getCompatibility } from '@/lib/data'

const clr = {
  border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
  purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff', nebula: '#0f0920',
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: clr.muted }}>{label}</span>
        <span style={{ fontSize: 14, color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(42,31,74,0.4)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

function CompatCircle({ value }: { value: number }) {
  const r = 54, circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  const color = value >= 75 ? '#7aab88' : value >= 50 ? '#9d7fe8' : '#c97c6a'
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(74,53,128,0.2)" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 1.2s ease' }} />
      <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="700" fill={color}>{value}</text>
      <text x="70" y="84" textAnchor="middle" fontSize="11" fill={clr.mutedDim}>%</text>
    </svg>
  )
}

export default function Uyumluluk() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [sign1, setSign1] = useState<number | null>(null)
  const [sign2, setSign2] = useState<number | null>(null)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const compat = sign1 !== null && sign2 !== null ? getCompatibility(sign1, sign2) : null

  const getAiAnalysis = async () => {
    if (sign1 === null || sign2 === null) return
    setAiLoading(true); setAiText('')
    const s1 = signs[sign1], s2 = signs[sign2]
    const q = lang === 'tr'
      ? `${s1.tr} ve ${s2.tr} burcunun uyumunu derinlemesine analiz et. Aşk, dostluk ve iş ilişkileri açısından değerlendir.`
      : `Deeply analyze the compatibility between ${s1.en} and ${s2.en}. Evaluate from love, friendship and work perspectives.`
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, lang }) })
      const data = await res.json()
      setAiText(data.answer)
    } catch { setAiText(lang === 'tr' ? 'Yıldızlar şu an sessiz...' : 'The stars are quiet now...') }
    setAiLoading(false)
  }

  const scoreLabels = lang === 'tr'
    ? { love: 'Aşk & İlişki', friend: 'Dostluk', work: 'İş & Kariyer' }
    : { love: 'Love & Romance', friend: 'Friendship', work: 'Work & Career' }

  return (
    <>
      <StarBg />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", color: clr.star }}>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: clr.mutedDim, marginBottom: 14 }}>✦ ✦ ✦</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: clr.star, marginBottom: 12 }}>
              {lang === 'tr' ? 'Burç Uyumluluğu' : 'Sign Compatibility'}
            </h1>
            <p style={{ color: clr.muted, fontSize: 14 }}>
              {lang === 'tr' ? 'İki burcun yıldız enerjisini karşılaştır' : 'Compare the star energy of two signs'}
            </p>
          </div>

          {/* Sign selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'start', marginBottom: 36 }}>
            {/* Sign 1 */}
            <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '20px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 14, textAlign: 'center' }}>
                {lang === 'tr' ? 'BİRİNCİ BURÇ' : 'FIRST SIGN'}
              </div>
              {sign1 !== null && (
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 36, color: signs[sign1].color }}>{signs[sign1].symbol}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: clr.purpleLight }}>{lang === 'tr' ? signs[sign1].tr : signs[sign1].en}</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {signs.map((s, i) => (
                  <button key={s.slug} onClick={() => { setSign1(i); setAiText('') }} style={{
                    padding: '8px 4px', borderRadius: 10, textAlign: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
                    background: sign1 === i ? `${s.color}30` : 'rgba(74,53,128,0.1)',
                    outline: sign1 === i ? `1px solid ${s.color}80` : `0.5px solid rgba(74,53,128,0.2)`,
                  }}>
                    <div style={{ fontSize: 16, color: sign1 === i ? s.color : clr.muted }}>{s.symbol}</div>
                    <div style={{ fontSize: 9.5, color: sign1 === i ? clr.purpleLight : clr.mutedDim, marginTop: 2 }}>{lang === 'tr' ? s.tr : s.en}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: clr.mutedDim }}>✦</div>
              <div style={{ fontSize: 13, color: clr.mutedDim, letterSpacing: '0.2em' }}>VS</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: clr.mutedDim }}>✦</div>
            </div>

            {/* Sign 2 */}
            <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '20px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 14, textAlign: 'center' }}>
                {lang === 'tr' ? 'İKİNCİ BURÇ' : 'SECOND SIGN'}
              </div>
              {sign2 !== null && (
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 36, color: signs[sign2].color }}>{signs[sign2].symbol}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: clr.purpleLight }}>{lang === 'tr' ? signs[sign2].tr : signs[sign2].en}</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {signs.map((s, i) => (
                  <button key={s.slug} onClick={() => { setSign2(i); setAiText('') }} style={{
                    padding: '8px 4px', borderRadius: 10, textAlign: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
                    background: sign2 === i ? `${s.color}30` : 'rgba(74,53,128,0.1)',
                    outline: sign2 === i ? `1px solid ${s.color}80` : `0.5px solid rgba(74,53,128,0.2)`,
                  }}>
                    <div style={{ fontSize: 16, color: sign2 === i ? s.color : clr.muted }}>{s.symbol}</div>
                    <div style={{ fontSize: 9.5, color: sign2 === i ? clr.purpleLight : clr.mutedDim, marginTop: 2 }}>{lang === 'tr' ? s.tr : s.en}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {compat && (
            <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, marginBottom: 20 }}>

                {/* Overall circle */}
                <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '24px', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 4 }}>
                    {lang === 'tr' ? 'GENEL UYUM' : 'OVERALL'}
                  </div>
                  <CompatCircle value={compat.overall} />
                  <div style={{ fontSize: 12, color: clr.mutedDim, textAlign: 'center' }}>
                    {compat.overall >= 75 ? (lang === 'tr' ? 'Mükemmel uyum! ✨' : 'Perfect match! ✨')
                      : compat.overall >= 55 ? (lang === 'tr' ? 'İyi uyum 🌙' : 'Good match 🌙')
                      : (lang === 'tr' ? 'Zorlu ama mümkün 🔥' : 'Challenging but possible 🔥')}
                  </div>
                </div>

                {/* Score bars */}
                <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '28px', backdropFilter: 'blur(12px)' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 22 }}>
                    {lang === 'tr' ? 'DETAYLI ANALİZ' : 'DETAILED ANALYSIS'}
                  </div>
                  <ScoreBar label={scoreLabels.love}   value={compat.love}   color="#c97c6a" />
                  <ScoreBar label={scoreLabels.friend} value={compat.friend} color="#9d7fe8" />
                  <ScoreBar label={scoreLabels.work}   value={compat.work}   color="#7aab88" />
                </div>
              </div>

              {/* AI Analysis */}
              <div style={{ background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '28px', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 18 }}>
                  {lang === 'tr' ? 'AI DERİN ANALİZİ' : 'AI DEEP ANALYSIS'}
                </div>
                {!aiText && !aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <p style={{ fontSize: 13, color: clr.muted, lineHeight: 1.7 }}>
                      {lang === 'tr'
                        ? `Phoebix AI, ${signs[sign1!].tr} ve ${signs[sign2!].tr} uyumunu yıldızların perspektifinden derinlemesine analiz etsin.`
                        : `Let Phoebix AI deeply analyze the ${signs[sign1!].en} and ${signs[sign2!].en} compatibility from the stars' perspective.`}
                    </p>
                    <button onClick={getAiAnalysis} style={{ flexShrink: 0, padding: '11px 22px', background: clr.purple, border: 'none', borderRadius: 12, color: clr.star, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      ✦ {lang === 'tr' ? 'Analiz Et' : 'Analyze'}
                    </button>
                  </div>
                )}
                {aiLoading && (
                  <div style={{ fontSize: 13, color: clr.mutedDim, fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                    {lang === 'tr' ? 'Yıldızlar konuşuyor...' : 'The stars are speaking...'}
                  </div>
                )}
                {aiText && (
                  <>
                    <p style={{ fontSize: 14, color: clr.muted, lineHeight: 1.85 }}>{aiText}</p>
                    <button onClick={() => { setAiText('') }} style={{ marginTop: 14, fontSize: 12, color: clr.mutedDim, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      {lang === 'tr' ? 'Yenile' : 'Refresh'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {!compat && (
            <div style={{ textAlign: 'center', padding: '32px', color: clr.mutedDim, fontSize: 14 }}>
              {lang === 'tr' ? 'İki burç seç ve uyumu keşfet ✦' : 'Select two signs to discover compatibility ✦'}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
