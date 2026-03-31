'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const clr = {
  bg: '#04020e', deep: '#0a0618', nebula: '#0f0920',
  border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
  purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff',
}

const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const SIGN_TR = ['Koç','Boğa','İkizler','Yengeç','Aslan','Başak','Terazi','Akrep','Yay','Oğlak','Kova','Balık']
const SIGN_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const ELEMENT_COLORS = [
  '#c97c6a','#7aab88','#9ab0cc','#6a83c9', // Aries Taurus Gemini Cancer
  '#c97c6a','#7aab88','#9ab0cc','#6a83c9', // Leo Virgo Libra Scorpio
  '#c97c6a','#7aab88','#9ab0cc','#6a83c9', // Sag Cap Aqua Pisces
]

interface Planet {
  key: string; tr: string; en: string; glyph: string
  lon: number; retrograde: boolean; color: string
  signIndex: number; signTr: string; signEn: string; degree: number
}

interface ChartData {
  planets: Planet[]
  ascendant: number; ascendantSign: string; ascendantSignEn: string
  mc: number; mcSign: string; mcSignEn: string
}

// SVG coordinate helpers
const CX = 250, CY = 250
const R_OUTER = 215, R_SIGN_INNER = 172, R_PLANET = 148, R_INNER = 115

function chartAngle(lon: number, asc: number) {
  return ((lon - asc + 360) % 360)
}

function svgPoint(chartDeg: number, r: number) {
  const rad = (180 - chartDeg) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function BirthChartSVG({ data, lang }: { data: ChartData; lang: 'tr' | 'en' }) {
  const asc = data.ascendant

  // Zodiac segments
  const segments = SIGN_GLYPHS.map((glyph, i) => {
    const startLon = i * 30
    const endLon = startLon + 30
    const midLon = startLon + 15
    const startCA = chartAngle(startLon, asc)
    const endCA = chartAngle(endLon, asc)
    const midCA = chartAngle(midLon, asc)

    const p1 = svgPoint(startCA, R_OUTER)
    const p2 = svgPoint(startCA, R_SIGN_INNER)
    const p3 = svgPoint(endCA, R_SIGN_INNER)
    const p4 = svgPoint(endCA, R_OUTER)
    const midPt = svgPoint(midCA, (R_OUTER + R_SIGN_INNER) / 2)

    // Arc flags: large-arc if > 180°, but 30° is never large
    const startRad = (180 - startCA) * Math.PI / 180
    const endRad = (180 - endCA) * Math.PI / 180
    // path: line to outer arc, line back, inner arc back
    const dOuter = arcPath(CX, CY, R_OUTER, startRad, endRad, false)
    const dInner = arcPath(CX, CY, R_SIGN_INNER, startRad, endRad, false)

    const startOuterPt = svgPoint(startCA, R_OUTER)
    const endOuterPt = svgPoint(endCA, R_OUTER)
    const startInnerPt = svgPoint(startCA, R_SIGN_INNER)
    const endInnerPt = svgPoint(endCA, R_SIGN_INNER)

    const d = `M ${startOuterPt.x} ${startOuterPt.y} A ${R_OUTER} ${R_OUTER} 0 0 0 ${endOuterPt.x} ${endOuterPt.y} L ${endInnerPt.x} ${endInnerPt.y} A ${R_SIGN_INNER} ${R_SIGN_INNER} 0 0 1 ${startInnerPt.x} ${startInnerPt.y} Z`

    return { glyph, signTr: SIGN_TR[i], signEn: SIGN_EN[i], color: ELEMENT_COLORS[i], d, midPt, startCA }
  })

  // Planet positions (deduplicate crowded planets)
  const placed: { angle: number; planet: Planet }[] = []
  const sortedPlanets = [...data.planets].sort((a, b) => a.lon - b.lon)
  for (const planet of sortedPlanets) {
    const ca = chartAngle(planet.lon, asc)
    let adjusted = ca
    // avoid overlap: nudge if within 6° of already placed
    for (const p of placed) {
      let diff = Math.abs(adjusted - p.angle)
      if (diff > 180) diff = 360 - diff
      if (diff < 6) adjusted = p.angle + 7
    }
    placed.push({ angle: adjusted, planet })
  }

  // ASC / DSC / MC / IC lines
  const ascPt = svgPoint(0, R_OUTER + 12)
  const dscPt = svgPoint(180, R_OUTER + 12)
  const mcCA = chartAngle(data.mc, asc)
  const mcPt = svgPoint(mcCA, R_OUTER + 12)
  const icPt = svgPoint((mcCA + 180) % 360, R_OUTER + 12)

  return (
    <svg viewBox="0 0 500 500" width="100%" style={{ maxWidth: 480, display: 'block' }}>
      {/* Background */}
      <circle cx={CX} cy={CY} r={R_OUTER + 15} fill="#07041a" />

      {/* Zodiac segments */}
      {segments.map((seg, i) => (
        <g key={i}>
          <path d={seg.d} fill={`${seg.color}18`} stroke={`${seg.color}50`} strokeWidth="0.5" />
          <text
            x={seg.midPt.x} y={seg.midPt.y}
            textAnchor="middle" dominantBaseline="central"
            fontSize="13" fill={`${seg.color}cc`} style={{ userSelect: 'none' }}
          >
            {seg.glyph}
          </text>
        </g>
      ))}

      {/* Degree tick marks on inner edge of zodiac ring */}
      {Array.from({ length: 72 }, (_, i) => {
        const tickLon = i * 5
        const ca = chartAngle(tickLon, asc)
        const isMajor = tickLon % 30 === 0
        const outer = svgPoint(ca, R_SIGN_INNER)
        const inner = svgPoint(ca, R_SIGN_INNER - (isMajor ? 8 : 4))
        return (
          <line key={i} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y}
            stroke={isMajor ? 'rgba(196,181,247,0.4)' : 'rgba(74,53,128,0.3)'} strokeWidth={isMajor ? '0.8' : '0.5'} />
        )
      })}

      {/* House circle */}
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(74,53,128,0.25)" strokeWidth="0.8" />
      <circle cx={CX} cy={CY} r={R_PLANET - 18} fill="none" stroke="rgba(74,53,128,0.15)" strokeWidth="0.5" />

      {/* Whole sign house lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const houseCusp = i * 30 // Whole sign: house i starts at asc_sign*30 + i*30
        const ascSignStart = Math.floor(asc / 30) * 30
        const cuspLon = (ascSignStart + houseCusp) % 360
        const ca = chartAngle(cuspLon, asc)
        const outer = svgPoint(ca, R_SIGN_INNER)
        const inner = svgPoint(ca, R_INNER)
        return (
          <line key={i} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y}
            stroke="rgba(123,94,168,0.3)" strokeWidth="0.6" strokeDasharray={i === 0 ? 'none' : '2,4'} />
        )
      })}

      {/* ASC / DSC axis */}
      <line x1={svgPoint(0, R_INNER).x} y1={svgPoint(0, R_INNER).y}
            x2={svgPoint(180, R_INNER).x} y2={svgPoint(180, R_INNER).y}
            stroke="rgba(196,181,247,0.5)" strokeWidth="1" />

      {/* MC / IC axis */}
      <line x1={svgPoint(mcCA, R_INNER).x} y1={svgPoint(mcCA, R_INNER).y}
            x2={svgPoint((mcCA + 180) % 360, R_INNER).x} y2={svgPoint((mcCA + 180) % 360, R_INNER).y}
            stroke="rgba(157,127,232,0.4)" strokeWidth="0.8" strokeDasharray="3,4" />

      {/* Planet lines to center */}
      {placed.map(({ angle, planet }) => {
        const pt = svgPoint(angle, R_PLANET)
        const innerPt = svgPoint(angle, R_INNER + 4)
        return (
          <line key={planet.key} x1={pt.x} y1={pt.y} x2={innerPt.x} y2={innerPt.y}
            stroke={`${planet.color}40`} strokeWidth="0.7" />
        )
      })}

      {/* Planet dots and glyphs */}
      {placed.map(({ angle, planet }) => {
        const pt = svgPoint(angle, R_PLANET)
        return (
          <g key={planet.key}>
            <circle cx={pt.x} cy={pt.y} r="10" fill={`${planet.color}20`} stroke={`${planet.color}80`} strokeWidth="0.8" />
            <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
              fontSize="11" fill={planet.color} style={{ userSelect: 'none' }}>
              {planet.glyph}
            </text>
            {planet.retrograde && (
              <text x={pt.x + 8} y={pt.y - 7} fontSize="7" fill="rgba(196,181,247,0.7)" style={{ userSelect: 'none' }}>ℛ</text>
            )}
          </g>
        )
      })}

      {/* ASC label */}
      <text x={svgPoint(0, R_OUTER + 25).x} y={svgPoint(0, R_OUTER + 25).y}
        textAnchor="middle" dominantBaseline="central" fontSize="9"
        fill="rgba(196,181,247,0.8)" fontWeight="600" style={{ userSelect: 'none' }}>
        ASC
      </text>
      <text x={svgPoint(180, R_OUTER + 25).x} y={svgPoint(180, R_OUTER + 25).y}
        textAnchor="middle" dominantBaseline="central" fontSize="9"
        fill="rgba(157,127,232,0.6)" style={{ userSelect: 'none' }}>
        DSC
      </text>
      <text x={svgPoint(mcCA, R_OUTER + 25).x} y={svgPoint(mcCA, R_OUTER + 25).y}
        textAnchor="middle" dominantBaseline="central" fontSize="9"
        fill="rgba(157,127,232,0.6)" style={{ userSelect: 'none' }}>
        MC
      </text>
      <text x={svgPoint((mcCA + 180) % 360, R_OUTER + 25).x} y={svgPoint((mcCA + 180) % 360, R_OUTER + 25).y}
        textAnchor="middle" dominantBaseline="central" fontSize="9"
        fill="rgba(157,127,232,0.5)" style={{ userSelect: 'none' }}>
        IC
      </text>

      {/* Center info */}
      <text x={CX} y={CY - 10} textAnchor="middle" fontSize="11" fill="rgba(196,181,247,0.6)" style={{ userSelect: 'none' }}>
        {lang === 'tr' ? 'YÜK.' : 'ASC'}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="14"
        fill={clr.purpleLight} style={{ fontFamily: "'Cormorant Garamond', serif", userSelect: 'none' }}>
        {SIGN_GLYPHS[Math.floor(data.ascendant / 30)]}
      </text>
    </svg>
  )
}

function arcPath(cx: number, cy: number, r: number, startRad: number, endRad: number, clockwise: boolean) {
  const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad)
  return `A ${r} ${r} 0 0 ${clockwise ? 1 : 0} ${x2} ${y2}`
}

export default function DogumHaritasi() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [city, setCity] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = {
    tr: {
      title: 'Doğum Haritası', subtitle: 'Gezegenler doğduğun an neredeydi?',
      dateLabel: 'Doğum Tarihi', timeLabel: 'Doğum Saati',
      cityLabel: 'Doğum Yeri', cityPlaceholder: 'İstanbul, Ankara...',
      findLocation: 'Koordinatları Bul', latLabel: 'Enlem', lngLabel: 'Boylam',
      calculate: 'Haritayı Hesapla', calculating: 'Hesaplanıyor...',
      geocoding: 'Konum aranıyor...', geocodeErr: 'Konum bulunamadı.',
      chartTitle: 'Doğum Haritası', planetsTitle: 'Gezegen Pozisyonları',
      planet: 'Gezegen', sign: 'Burç', degree: 'Derece', retro: 'R',
      ascLabel: 'Yükselen', mcLabel: 'Gökyüzü Ortası (MC)',
      in: 'burcunda',
    },
    en: {
      title: 'Birth Chart', subtitle: 'Where were the planets when you were born?',
      dateLabel: 'Date of Birth', timeLabel: 'Time of Birth',
      cityLabel: 'Place of Birth', cityPlaceholder: 'New York, London...',
      findLocation: 'Find Coordinates', latLabel: 'Latitude', lngLabel: 'Longitude',
      calculate: 'Calculate Chart', calculating: 'Calculating...',
      geocoding: 'Looking up location...', geocodeErr: 'Location not found.',
      chartTitle: 'Birth Chart', planetsTitle: 'Planet Positions',
      planet: 'Planet', sign: 'Sign', degree: 'Degree', retro: 'R',
      ascLabel: 'Ascendant', mcLabel: 'Midheaven (MC)',
      in: 'in',
    },
  }[lang]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2, speed: 0.003 + Math.random() * 0.004, o: Math.random(),
    }))
    let frame = 0, raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.o = 0.12 + 0.7 * Math.abs(Math.sin(frame * s.speed))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196,181,247,${s.o})`; ctx.fill()
      })
      frame++; raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  async function geocodeCity() {
    if (!city.trim()) return
    setGeocoding(true); setGeocodeError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        { headers: { 'Accept-Language': lang } }
      )
      const data = await res.json()
      if (!data.length) { setGeocodeError(t.geocodeErr); setGeocoding(false); return }
      setLat(parseFloat(data[0].lat).toFixed(4))
      setLng(parseFloat(data[0].lon).toFixed(4))
    } catch {
      setGeocodeError(t.geocodeErr)
    }
    setGeocoding(false)
  }

  async function calculate() {
    if (!date || !time || !lat || !lng) return
    setLoading(true); setError(''); setChartData(null)
    try {
      const res = await fetch('/api/birthchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, lat: parseFloat(lat), lng: parseFloat(lng) }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setChartData(data)
    } catch {
      setError(lang === 'tr' ? 'Hesaplama hatası. Bilgileri kontrol et.' : 'Calculation error. Check your inputs.')
    }
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', color: clr.star, fontFamily: "'DM Sans', system-ui, sans-serif" }}>



        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: clr.mutedDim, marginBottom: 16 }}>✦ ✦ ✦</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,5vw,58px)', fontWeight: 300, color: clr.star, marginBottom: 12 }}>
              {t.title}
            </h1>
            <p style={{ color: clr.muted, fontSize: 15 }}>{t.subtitle}</p>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(15,9,32,0.7)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '32px 36px', maxWidth: 560, margin: '0 auto 48px', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 8 }}>
                  {t.dateLabel.toUpperCase()}
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today}
                  style={{ width: '100%', background: 'rgba(4,2,14,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif", colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 8 }}>
                  {t.timeLabel.toUpperCase()}
                </label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  style={{ width: '100%', background: 'rgba(4,2,14,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif", colorScheme: 'dark' }} />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 8 }}>
                {t.cityLabel.toUpperCase()}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={city} onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && geocodeCity()}
                  placeholder={t.cityPlaceholder}
                  style={{ flex: 1, background: 'rgba(4,2,14,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif" }} />
                <button onClick={geocodeCity} disabled={geocoding || !city.trim()}
                  style={{ padding: '10px 16px', background: 'rgba(123,94,168,0.25)', border: `0.5px solid rgba(123,94,168,0.5)`, borderRadius: 10, color: clr.purpleGlow, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
                  {geocoding ? '...' : t.findLocation}
                </button>
              </div>
              {geocodeError && <p style={{ fontSize: 12, color: '#ff7b7b', marginTop: 6 }}>{geocodeError}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 8 }}>
                  {t.latLabel.toUpperCase()}
                </label>
                <input type="number" value={lat} onChange={e => setLat(e.target.value)} placeholder="41.0082"
                  style={{ width: '100%', background: 'rgba(4,2,14,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif" }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: clr.mutedDim, marginBottom: 8 }}>
                  {t.lngLabel.toUpperCase()}
                </label>
                <input type="number" value={lng} onChange={e => setLng(e.target.value)} placeholder="28.9784"
                  style={{ width: '100%', background: 'rgba(4,2,14,0.8)', border: `0.5px solid rgba(74,53,128,0.5)`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </div>

            <button onClick={calculate} disabled={loading || !date || !time || !lat || !lng}
              style={{ width: '100%', padding: '14px', background: loading || !date || !time || !lat || !lng ? 'rgba(123,94,168,0.2)' : clr.purple, border: 'none', borderRadius: 12, color: clr.star, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s', letterSpacing: '0.05em' }}
              className="bp">
              {loading ? t.calculating : t.calculate}
            </button>

            {error && <p style={{ textAlign: 'center', fontSize: 13, color: '#ff7b7b', marginTop: 12 }}>{error}</p>}
          </div>

          {/* Chart Result */}
          {chartData && (
            <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              {/* ASC + MC summary */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
                {[
                  { label: t.ascLabel, sign: lang === 'tr' ? chartData.ascendantSign : chartData.ascendantSignEn, lon: chartData.ascendant },
                  { label: t.mcLabel, sign: lang === 'tr' ? chartData.mcSign : chartData.mcSignEn, lon: chartData.mc },
                ].map(({ label, sign, lon }) => (
                  <div key={label} style={{ background: 'rgba(15,9,32,0.7)', border: `0.5px solid ${clr.border}`, borderRadius: 14, padding: '18px 28px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 8 }}>{label.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: clr.purpleLight }}>
                      {SIGN_GLYPHS[Math.floor(lon / 30)]} {sign}
                    </div>
                    <div style={{ fontSize: 12, color: clr.mutedDim, marginTop: 4 }}>
                      {(lon % 30).toFixed(1)}°
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + table layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 32, alignItems: 'start' }}>

                {/* SVG chart */}
                <div style={{ background: 'rgba(7,4,26,0.85)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '20px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 14, textAlign: 'center' }}>
                    {t.chartTitle.toUpperCase()}
                  </div>
                  <BirthChartSVG data={chartData} lang={lang} />
                </div>

                {/* Planet table */}
                <div style={{ background: 'rgba(15,9,32,0.7)', border: `0.5px solid ${clr.border}`, borderRadius: 18, padding: '24px 20px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', color: clr.mutedDim, marginBottom: 18 }}>
                    {t.planetsTitle.toUpperCase()}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {[t.planet, t.sign, t.degree].map(h => (
                          <th key={h} style={{ fontSize: 10, letterSpacing: '0.15em', color: clr.mutedDim, textAlign: 'left', paddingBottom: 12, fontWeight: 400 }}>
                            {h.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.planets.map((p, i) => (
                        <tr key={p.key} style={{ borderTop: `0.5px solid rgba(74,53,128,0.2)` }}>
                          <td style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 9 }}>
                            <span style={{ fontSize: 16, color: p.color }}>{p.glyph}</span>
                            <span style={{ fontSize: 13, color: clr.muted }}>
                              {lang === 'tr' ? p.tr : p.en}
                            </span>
                            {p.retrograde && (
                              <span style={{ fontSize: 10, color: 'rgba(196,181,247,0.5)', fontStyle: 'italic' }}>ℛ</span>
                            )}
                          </td>
                          <td style={{ padding: '11px 8px', fontSize: 14 }}>
                            <span style={{ color: ELEMENT_COLORS[p.signIndex] }}>{SIGN_GLYPHS[p.signIndex]}</span>
                            <span style={{ fontSize: 13, color: clr.muted, marginLeft: 6 }}>
                              {lang === 'tr' ? p.signTr : p.signEn}
                            </span>
                          </td>
                          <td style={{ padding: '11px 0', fontSize: 13, color: clr.mutedDim }}>
                            {p.degree.toFixed(1)}°
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `0.5px solid ${clr.border}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, letterSpacing: '0.2em', color: 'rgba(90,77,128,0.55)' }}>PHOEBIX</div>
          <div style={{ fontSize: 11, color: 'rgba(90,77,128,0.35)' }}>© 2026 Phoebix</div>
        </footer>
      </div>
    </>
  )
}
