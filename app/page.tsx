'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signs } from '@/lib/data'

const dailyTexts: Record<string, string[]> = {
  tr: [
    "Mars'ın güçlü pozisyonu enerjini artırıyor. Yeni başlangıçlar için mükemmel bir an — kariyer ve kişisel projeler söz konusuysa özellikle. Sezgilerine güven.",
    "Venüs seni destekliyor. Mali konularda sezgilerine güven, ilişkilerde sabırlı ol. Hafta sonu sürpriz bir gelişme kapıda.",
    "Merkür'ün etkisiyle iletişimin zirveye çıkıyor. Önemli görüşmeler için bugün ideal. Çift taraflı düşün, her iki tarafı da dinle.",
    "Ay kendi burcunda — duygular yüzeye çıkıyor. İç sesinle yüzleş, geçmişi bırakma zamanı. Akşam saatleri huzur getirecek.",
    "Güneş burcunu aydınlatıyor. Liderlik enerjin yüksek, takımını motive edebilirsin. Yaratıcı projeler için harika bir gün.",
    "Merkür analitik gücünü artırıyor. Detaylara dikkat et, sağlık konularında öz bakımı ihmal etme. Verimli bir çalışma günü.",
    "Venüs denge getiriyor. İlişkilerde adil ol, sanat ve güzelliğe zaman ayır. Önemli kararları bu hafta ver.",
    "Plüton dönüşüm enerjisi veriyor. Derinlik ve gizem seni çekiyor. Finansal konularda önemli bir keşif yaklaşıyor.",
    "Jüpiter şansını artırıyor. Seyahat ve eğitim konuları öne çıkıyor. Ufkunu genişletecek bir fırsat kapıda.",
    "Satürn disiplini ödüllendiriyor. Uzun vadeli hedeflere odaklan, kariyerde somut adımlar at. Emek boşa gitmeyecek.",
    "Uranüs yenilik enerjisi veriyor. Alışılmışın dışına çık, teknoloji ve toplulukla bağlantı kur. Özgün fikirlerin değer görüyor.",
    "Neptün sezgini keskinleştiriyor. Rüyalarına dikkat et, manevi konular ön plana çıkıyor. Yaratıcılık dorukta.",
  ],
  en: [
    "Mars boosts your energy. A perfect time for new beginnings — especially in career and personal projects. Trust your instincts.",
    "Venus supports you. Trust your intuition in finances, be patient in relationships. A surprise awaits this weekend.",
    "Mercury elevates your communication. Today is ideal for important conversations. Think from both sides.",
    "The Moon is in your sign — emotions rise to the surface. Face your inner voice, it is time to let go of the past.",
    "The Sun illuminates your sign. Your leadership energy is high. A wonderful day for creative projects.",
    "Mercury amplifies your analytical power. Pay attention to details, do not neglect self-care in health matters.",
    "Venus brings balance. Be fair in relationships, make time for art and beauty. Make important decisions this week.",
    "Pluto brings transformative energy. Depth and mystery draw you in. An important discovery approaches.",
    "Jupiter increases your luck. Travel and education themes emerge. An opportunity to broaden your horizons is at the door.",
    "Saturn rewards discipline. Focus on long-term goals, take concrete steps in your career.",
    "Uranus brings innovative energy. Step outside the ordinary, connect with technology and community.",
    "Neptune sharpens your intuition. Pay attention to your dreams, spiritual matters come to the forefront.",
  ]
}

const energyData = [
  [82, 65, 71, 90], [75, 88, 60, 72], [91, 70, 85, 68], [65, 55, 90, 78],
  [88, 95, 72, 85], [70, 92, 88, 65], [95, 75, 68, 82], [72, 68, 75, 95],
  [80, 85, 70, 98], [65, 95, 82, 75], [78, 88, 65, 85], [90, 65, 95, 80],
]

export default function Home() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  const [selected, setSelected] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: "Venüs'ün şu anki pozisyonu ilişkilerinde yeni bir kapı aralıyor. Yükselen burcunun etkisiyle bu enerjiyi iletişimde kullanabilirsin..." }
  ])
  const [aiLoading, setAiLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2, speed: 0.003 + Math.random() * 0.005, o: Math.random()
    }))
    let frame = 0
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.o = 0.15 + 0.75 * Math.abs(Math.sin(frame * s.speed))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196,181,247,${s.o})`; ctx.fill()
      })
      frame++; raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return
    const q = aiInput.trim(); setAiInput('')
    setAiMessages(p => [...p, { role: 'user', text: q }])
    setAiLoading(true)
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, lang }) })
      const data = await res.json()
      setAiMessages(p => [...p, { role: 'ai', text: data.answer }])
    } catch {
      setAiMessages(p => [...p, { role: 'ai', text: lang === 'tr' ? 'Yıldızlar şu an sessiz... Biraz sonra tekrar dene.' : 'The stars are quiet now...' }])
    }
    setAiLoading(false)
  }

  const clr = {
    bg: '#04020e', deep: '#0a0618', nebula: '#0f0920',
    border: 'rgba(74,53,128,0.3)', purple: '#7b5ea8',
    purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
    muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff',
  }

  return (
    <>
      

      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />

      <div style={{ position:'relative', zIndex:1, fontFamily:"'DM Sans', system-ui, sans-serif", color:clr.star, minHeight:'100vh', background:'transparent' }}>

        {/* NAV */}
        <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 32px', borderBottom:`0.5px solid ${clr.border}`, backdropFilter:'blur(8px)' }}>
          <Link href="/" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, letterSpacing:'0.25em', color:clr.purpleLight, fontWeight:400, textDecoration:'none' }}>PHOEBIX</Link>
          <div style={{ display:'flex', gap:28 }}>
            {(lang==='tr'
              ? [['Burçlar','/burclar'],['Harita','/dogum-haritasi'],['Uyumluluk','/uyumluluk'],['AI Yorum','/ai-yorum']]
              : [['Signs','/burclar'],['Chart','/dogum-haritasi'],['Compatibility','/uyumluluk'],['AI Reading','/ai-yorum']]
            ).map(([l, href]) => (
              <Link key={l} href={href} className="nl" style={{ fontSize:13, color:clr.muted, textDecoration:'none', transition:'color 0.2s' }}>{l}</Link>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button onClick={() => setLang(lang==='tr'?'en':'tr')} style={{ fontSize:11, padding:'5px 12px', border:`0.5px solid ${clr.border}`, borderRadius:20, color:clr.muted, background:'transparent', cursor:'pointer' }}>
              {lang==='tr' ? 'TR / EN' : 'EN / TR'}
            </button>
            <Link href="/giris" style={{ fontSize:12, padding:'6px 16px', border:`0.5px solid rgba(123,94,168,0.4)`, borderRadius:20, color:clr.purpleGlow, background:'transparent', cursor:'pointer', textDecoration:'none' }}>
              {lang==='tr' ? 'Giriş' : 'Login'}
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="fu" style={{ textAlign:'center', padding:'80px 24px 64px', borderBottom:`0.5px solid ${clr.border}` }}>
          <div style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:28, color:'rgba(90,77,128,0.6)', letterSpacing:'0.5em', fontSize:11 }}>
            <span>✦</span><span>✦</span><span>✦</span>
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(36px,6vw,72px)', fontWeight:300, lineHeight:1.15, marginBottom:22, maxWidth:720, margin:'0 auto 22px' }}>
            <span style={{ color:clr.star }}>{lang==='tr' ? 'Evrenin seni nasıl ' : 'Discover how the universe '}</span>
            <em style={{ background:`linear-gradient(135deg, ${clr.purpleLight}, ${clr.purpleGlow})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>
              {lang==='tr' ? 'şekillendirdiğini' : 'shapes you'}
            </em>
            {lang==='tr' && <span style={{ color:clr.star }}> keşfet</span>}
          </h1>
          <p style={{ color:clr.muted, fontSize:16, lineHeight:1.8, maxWidth:500, margin:'0 auto 40px' }}>
            {lang==='tr'
              ? 'Doğum haritandan günlük burç yorumuna, AI destekli kişisel rehberliğe kadar — yıldızların diliyle.'
              : 'From your birth chart to daily horoscopes, AI-powered personal guidance — in the language of the stars.'}
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/dogum-haritasi" className="bp" style={{ padding:'13px 30px', background:clr.purple, border:'none', borderRadius:30, color:clr.star, fontSize:14, cursor:'pointer', transition:'all 0.2s', fontFamily:"'DM Sans', sans-serif", textDecoration:'none', display:'inline-block' }}>
              {lang==='tr' ? 'Haritanı hesapla' : 'Calculate your chart'}
            </Link>
            <Link href="/gunluk-yorum" className="bs" style={{ padding:'13px 30px', background:'transparent', border:`0.5px solid ${clr.border}`, borderRadius:30, color:clr.muted, fontSize:14, cursor:'pointer', transition:'all 0.2s', fontFamily:"'DM Sans', sans-serif", textDecoration:'none', display:'inline-block' }}>
              {lang==='tr' ? 'Günlük yorumum' : 'My daily reading'}
            </Link>
          </div>
        </section>

        {/* SIGN STRIP */}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8, padding:'20px 24px', borderBottom:`0.5px solid ${clr.border}` }}>
          {signs.map((s, i) => (
            <Link key={s.en} href={`/gunluk-yorum?sign=${s.slug}`} className="sp" onClick={() => setSelected(i)} style={{
              padding:'7px 15px', borderRadius:20, fontSize:13, cursor:'pointer', transition:'all 0.2s',
              border: selected===i ? `0.5px solid rgba(123,94,168,0.7)` : `0.5px solid ${clr.border}`,
              background: selected===i ? 'rgba(74,53,128,0.3)' : 'transparent',
              color: selected===i ? clr.purpleLight : clr.muted,
              fontFamily:"'DM Sans', sans-serif", textDecoration:'none', display:'inline-block',
            }}>
              {s.symbol} {lang==='tr' ? s.tr : s.en}
            </Link>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', borderBottom:`0.5px solid ${clr.border}` }}>
          {(lang==='tr'
            ? [['☀','Günlük Yorum','Her gün yenilenen kişisel yorumlar','/gunluk-yorum'],['◎','Doğum Haritası','Gezegen pozisyonlarının derin analizi','/dogum-haritasi'],['♡','Uyumluluk','İki haritanın çok boyutlu analizi','/uyumluluk'],['✦','AI Astrologun','Sorularını yanıtlayan kişisel rehberin','/ai-yorum']]
            : [['☀','Daily Reading','Personal readings renewed every day','/gunluk-yorum'],['◎','Birth Chart','Deep analysis of planetary positions','/dogum-haritasi'],['♡','Compatibility','Multi-dimensional chart analysis','/uyumluluk'],['✦','AI Astrologer','Your personal guide answering questions','/ai-yorum']]
          ).map(([icon,title,desc,href]) => (
            <Link key={title as string} href={href as string} className="fc" style={{ padding:'28px 24px', borderRight:`0.5px solid ${clr.border}`, transition:'background 0.2s', cursor:'pointer', textDecoration:'none', display:'block' }}>
              <div style={{ width:36, height:36, borderRadius:8, background:clr.nebula, border:`0.5px solid ${clr.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, color:clr.purpleGlow, fontSize:16 }}>{icon}</div>
              <div style={{ fontSize:13, fontWeight:500, color:clr.purpleLight, marginBottom:8 }}>{title}</div>
              <div style={{ fontSize:12, color:clr.mutedDim, lineHeight:1.65 }}>{desc}</div>
            </Link>
          ))}
        </div>

        {/* DAILY */}
        <section style={{ padding:'44px 32px', borderBottom:`0.5px solid ${clr.border}` }}>
          <div style={{ fontSize:11, letterSpacing:'0.25em', color:clr.mutedDim, marginBottom:24 }}>
            {lang==='tr' ? 'GÜNLÜK YORUM' : 'DAILY READING'}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
            {signs.slice(0,6).map((s,i) => (
              <button key={s.en} onClick={() => setSelected(i)} style={{
                padding:'10px 16px', borderRadius:12, textAlign:'center', cursor:'pointer', transition:'all 0.2s', minWidth:72,
                background: selected===i ? 'rgba(74,53,128,0.4)' : clr.nebula,
                border: selected===i ? `0.5px solid rgba(123,94,168,0.6)` : `0.5px solid ${clr.border}`,
                fontFamily:"'DM Sans', sans-serif",
              }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.symbol}</div>
                <div style={{ fontSize:11, color:clr.muted }}>{lang==='tr' ? s.tr : s.en}</div>
              </button>
            ))}
          </div>
          <div style={{ background:clr.nebula, border:`0.5px solid ${clr.border}`, borderRadius:16, padding:'26px 28px', maxWidth:640 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, color:clr.purpleLight, fontWeight:400 }}>
                  {signs[selected].symbol} {lang==='tr' ? signs[selected].tr : signs[selected].en}
                </div>
                <div style={{ fontSize:11, color:clr.mutedDim, marginTop:4 }}>
                  {new Date().toLocaleDateString(lang==='tr'?'tr-TR':'en-US',{day:'numeric',month:'long',year:'numeric'})}
                </div>
              </div>
              <span style={{ fontSize:11, padding:'4px 12px', background:'rgba(42,31,74,0.5)', border:`0.5px solid ${clr.border}`, borderRadius:12, color:clr.muted }}>
                {lang==='tr' ? 'Bugün' : 'Today'}
              </span>
            </div>
            <p style={{ fontSize:14, color:clr.muted, lineHeight:1.8, marginBottom:22 }}>{dailyTexts[lang][selected]}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {(lang==='tr' ? ['Aşk','Kariyer','Sağlık','Şans'] : ['Love','Career','Health','Luck']).map((label,i) => (
                <div key={label}>
                  <div style={{ fontSize:10, color:clr.mutedDim, marginBottom:7 }}>{label}</div>
                  <div style={{ height:3, background:'rgba(42,31,74,0.5)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${energyData[selected][i]}%`, background:clr.purple, borderRadius:2, transition:'width 0.7s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI */}
        <section style={{ padding:'44px 32px', borderBottom:`0.5px solid ${clr.border}`, background:'rgba(4,2,14,0.5)' }}>
          <div style={{ fontSize:11, letterSpacing:'0.25em', color:clr.mutedDim, marginBottom:24 }}>
            {lang==='tr' ? 'AI ASTROLOJİ ASISTANIN' : 'YOUR AI ASTROLOGY ASSISTANT'}
          </div>
          <div style={{ background:clr.nebula, border:`0.5px solid rgba(123,94,168,0.25)`, borderRadius:16, padding:'26px 28px', maxWidth:640 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:clr.purpleGlow, animation:'pulse 2s infinite' }} />
              <span style={{ fontSize:14, fontWeight:500, color:clr.purpleLight }}>
                {lang==='tr' ? 'Phoebix AI — Kişisel Astrologun' : 'Phoebix AI — Your Personal Astrologer'}
              </span>
            </div>
            <div style={{ maxHeight:200, overflowY:'auto', marginBottom:16, display:'flex', flexDirection:'column', gap:12 }}>
              {aiMessages.map((m,i) => (
                <div key={i} style={{ fontSize:13, lineHeight:1.75, color:m.role==='ai'?clr.muted:clr.purpleLight, textAlign:m.role==='ai'?'left':'right' }}>
                  {m.role==='ai' && <span style={{ color:'rgba(157,127,232,0.4)', marginRight:6, fontSize:11 }}>✦</span>}
                  {m.text}
                </div>
              ))}
              {aiLoading && <div style={{ fontSize:13, color:'rgba(139,125,181,0.4)', fontStyle:'italic' }}>
                {lang==='tr' ? 'Yıldızlar konuşuyor...' : 'The stars are speaking...'}
              </div>}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendAI()}
                placeholder={lang==='tr' ? 'Doğum haritam hakkında soru sor...' : 'Ask about your birth chart...'}
                style={{ flex:1, background:'rgba(4,2,14,0.8)', border:`0.5px solid ${clr.border}`, borderRadius:10, padding:'10px 14px', fontSize:13, color:clr.muted, fontFamily:"'DM Sans', sans-serif" }} />
              <button onClick={sendAI} disabled={aiLoading||!aiInput.trim()} style={{ padding:'10px 20px', background:aiLoading||!aiInput.trim()?'rgba(123,94,168,0.25)':clr.purple, border:'none', borderRadius:10, color:clr.star, fontSize:13, cursor:'pointer', fontFamily:"'DM Sans', sans-serif", transition:'background 0.2s' }}>
                {lang==='tr' ? 'Sor' : 'Ask'}
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding:'24px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:17, letterSpacing:'0.2em', color:'rgba(90,77,128,0.55)' }}>PHOEBIX</div>
          <div style={{ display:'flex', gap:20 }}>
            {(lang==='tr' ? ['Gizlilik','Kullanım','Hakkımızda','İletişim'] : ['Privacy','Terms','About','Contact']).map(l => (
              <span key={l} style={{ fontSize:12, color:'rgba(90,77,128,0.45)', cursor:'pointer' }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize:11, color:'rgba(90,77,128,0.35)' }}>© 2026 Phoebix</div>
        </footer>
      </div>
    </>
  )
}
