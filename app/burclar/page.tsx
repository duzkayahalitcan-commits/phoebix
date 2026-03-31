'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarBg from '@/components/StarBg'
import { signs } from '@/lib/data'

const clr = {
  border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
  purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff',
  nebula: '#0f0920',
}

const ELEMENT_LABEL: Record<string, { tr: string; en: string }> = {
  fire:  { tr: 'Ateş', en: 'Fire' },
  earth: { tr: 'Toprak', en: 'Earth' },
  air:   { tr: 'Hava', en: 'Air' },
  water: { tr: 'Su', en: 'Water' },
}

export default function Burclar() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? signs : signs.filter(s => s.element === filter)

  return (
    <>
      <StarBg />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", color: clr.star }}>

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `0.5px solid ${clr.border}`, backdropFilter: 'blur(12px)', background: 'rgba(4,2,14,0.75)' }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: '0.25em', color: clr.purpleLight, textDecoration: 'none' }}>PHOEBIX</Link>
          <div style={{ display: 'flex', gap: 24 }}>
            {([[lang==='tr'?'Burçlar':'Signs','/burclar'],[lang==='tr'?'Harita':'Chart','/dogum-haritasi'],[lang==='tr'?'Uyumluluk':'Compatibility','/uyumluluk'],[lang==='tr'?'AI Yorum':'AI Reading','/ai-yorum']] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} style={{ fontSize: 13, color: h==='/burclar' ? clr.purpleLight : clr.muted, textDecoration: 'none' }}>{l}</Link>
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
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: clr.star, marginBottom: 12 }}>
              {lang === 'tr' ? '12 Burç' : '12 Zodiac Signs'}
            </h1>
            <p style={{ color: clr.muted, fontSize: 14, maxWidth: 420, margin: '0 auto' }}>
              {lang === 'tr' ? 'Her burcun özellikleri, elementi ve gezegeni hakkında bilgi edin.' : 'Learn about each sign\'s traits, element and ruling planet.'}
            </p>
          </div>

          {/* Element filter */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            {['all', 'fire', 'earth', 'air', 'water'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                background: filter === f ? clr.purple : 'rgba(15,9,32,0.6)',
                color: filter === f ? clr.star : clr.muted,
                outline: filter === f ? 'none' : `0.5px solid rgba(74,53,128,0.3)`,
              }}>
                {f === 'all' ? (lang === 'tr' ? 'Hepsi' : 'All') : (lang === 'tr' ? ELEMENT_LABEL[f].tr : ELEMENT_LABEL[f].en)}
              </button>
            ))}
          </div>

          {/* Signs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filtered.map(s => (
              <Link key={s.slug} href={`/gunluk-yorum?sign=${s.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: 'rgba(15,9,32,0.75)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '24px',
                  backdropFilter: 'blur(12px)', transition: 'all 0.2s', cursor: 'pointer',
                }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}60`; (e.currentTarget as HTMLDivElement).style.background = `${s.color}0a` }}
                   onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = clr.border; (e.currentTarget as HTMLDivElement).style.background = 'rgba(15,9,32,0.75)' }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${s.color}20`, border: `1px solid ${s.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.symbol}</div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: clr.purpleLight }}>{lang === 'tr' ? s.tr : s.en}</div>
                      <div style={{ fontSize: 11, color: clr.mutedDim, marginTop: 2 }}>{s.dates}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 12.5, color: clr.muted, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: lang === 'tr' ? ELEMENT_LABEL[s.element].tr : ELEMENT_LABEL[s.element].en, color: s.color },
                      { label: s.planet, color: clr.mutedDim },
                    ].map(({ label, color }) => (
                      <span key={label} style={{ fontSize: 11, padding: '3px 10px', background: `${color}15`, border: `0.5px solid ${color}40`, borderRadius: 10, color }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
