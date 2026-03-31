export const signs = [
  { symbol: '♈', tr: 'Koç',     en: 'Aries',        slug: 'koc',     element: 'fire',  planet: 'Mars',   dates: '21 Mar – 19 Nis', modality: 'cardinal', color: '#c97c6a', luckyColor: 'Kırmızı',   luckyNum: 9,  luckyStone: 'Elmas',   desc: 'Cesur, enerjik ve öncü. Mars enerjisiyle dolu, her zaman ilk olmak ister.' },
  { symbol: '♉', tr: 'Boğa',    en: 'Taurus',       slug: 'boga',    element: 'earth', planet: 'Venüs', dates: '20 Nis – 20 May', modality: 'fixed',    color: '#7aab88', luckyColor: 'Yeşil',     luckyNum: 6,  luckyStone: 'Zümrüt',  desc: 'Sabırlı, güvenilir ve kararlı. Güzelliği, konforu ve istikrarı sever.' },
  { symbol: '♊', tr: 'İkizler', en: 'Gemini',       slug: 'ikizler', element: 'air',   planet: 'Merkür', dates: '21 May – 20 Haz', modality: 'mutable',  color: '#9ab0cc', luckyColor: 'Sarı',      luckyNum: 5,  luckyStone: 'Aytaşı',  desc: 'Zeki, meraklı ve iletişimci. Hızlı düşünen, çok yönlü bir zihin.' },
  { symbol: '♋', tr: 'Yengeç',  en: 'Cancer',       slug: 'yengec',  element: 'water', planet: 'Ay',    dates: '21 Haz – 22 Tem', modality: 'cardinal', color: '#6a83c9', luckyColor: 'Gümüş',     luckyNum: 2,  luckyStone: 'İnci',    desc: 'Hassas, sezgisel ve koruyucu. Aile ve ev, yaşamının merkezinde.' },
  { symbol: '♌', tr: 'Aslan',   en: 'Leo',          slug: 'aslan',   element: 'fire',  planet: 'Güneş', dates: '23 Tem – 22 Ağu', modality: 'fixed',    color: '#c9a96a', luckyColor: 'Altın',     luckyNum: 1,  luckyStone: 'Yakut',   desc: 'Karizmatik, cömert ve yaratıcı. Spotlight\'ı sever, lider doğmuş.' },
  { symbol: '♍', tr: 'Başak',   en: 'Virgo',        slug: 'basak',   element: 'earth', planet: 'Merkür', dates: '23 Ağu – 22 Eyl', modality: 'mutable',  color: '#7aab88', luckyColor: 'Lacivert',  luckyNum: 3,  luckyStone: 'Safir',   desc: 'Analitik, mükemmeliyetçi ve pratik. Detaylara dikkat eder, hizmet etmeyi sever.' },
  { symbol: '♎', tr: 'Terazi',  en: 'Libra',        slug: 'terazi',  element: 'air',   planet: 'Venüs', dates: '23 Eyl – 22 Eki', modality: 'cardinal', color: '#9ab0cc', luckyColor: 'Pembe',     luckyNum: 7,  luckyStone: 'Opal',    desc: 'Diplomatik, adil ve estetik duyarlı. Denge ve harmoniyi arar.' },
  { symbol: '♏', tr: 'Akrep',   en: 'Scorpio',      slug: 'akrep',   element: 'water', planet: 'Plüton', dates: '23 Eki – 21 Kas', modality: 'fixed',    color: '#a06a8a', luckyColor: 'Bordo',     luckyNum: 8,  luckyStone: 'Obsidyen', desc: 'Yoğun, tutkulu ve dönüştürücü. Derinlere iner, sırları sever.' },
  { symbol: '♐', tr: 'Yay',     en: 'Sagittarius',  slug: 'yay',     element: 'fire',  planet: 'Jüpiter', dates: '22 Kas – 21 Ara', modality: 'mutable',  color: '#c97c6a', luckyColor: 'Mor',       luckyNum: 3,  luckyStone: 'Turkuaz', desc: 'Özgür ruhlu, iyimser ve macerasever. Felsefe ve seyahat tutkunu.' },
  { symbol: '♑', tr: 'Oğlak',   en: 'Capricorn',    slug: 'oglak',   element: 'earth', planet: 'Satürn', dates: '22 Ara – 19 Oca', modality: 'cardinal', color: '#7aab88', luckyColor: 'Kahverengi', luckyNum: 8,  luckyStone: 'Oniks',   desc: 'Disiplinli, hırslı ve sabırlı. Hedeflerine adım adım ilerler.' },
  { symbol: '♒', tr: 'Kova',    en: 'Aquarius',     slug: 'kova',    element: 'air',   planet: 'Uranüs', dates: '20 Oca – 18 Şub', modality: 'fixed',    color: '#6a83c9', luckyColor: 'Elektrik Mavisi', luckyNum: 4, luckyStone: 'Ametist', desc: 'Yenilikçi, bağımsız ve insancıl. Geleceği görür, farklı düşünür.' },
  { symbol: '♓', tr: 'Balık',   en: 'Pisces',       slug: 'balik',   element: 'water', planet: 'Neptün', dates: '19 Şub – 20 Mar', modality: 'mutable',  color: '#6a8fa0', luckyColor: 'Deniz Mavisi', luckyNum: 7, luckyStone: 'Akvamarin', desc: 'Empatik, sezgisel ve yaratıcı. Rüya dünyası ile gerçeklik arasında yaşar.' },
]

// Compatibility matrix: element + modality compatibility score (0-100)
export function getCompatibility(i: number, j: number) {
  const s1 = signs[i], s2 = signs[j]
  const elementScore: Record<string, Record<string, number>> = {
    fire:  { fire: 85, air: 80, earth: 45, water: 40 },
    earth: { earth: 80, water: 75, fire: 45, air: 50 },
    air:   { air: 80, fire: 80, water: 45, earth: 50 },
    water: { water: 85, earth: 75, fire: 40, air: 45 },
  }
  const modalityBonus: Record<string, Record<string, number>> = {
    cardinal: { mutable: 10, fixed: 5, cardinal: 0 },
    fixed:    { mutable: 10, cardinal: 5, fixed: -5 },
    mutable:  { cardinal: 10, fixed: 10, mutable: 5 },
  }
  const base = elementScore[s1.element][s2.element]
  const bonus = modalityBonus[s1.modality][s2.modality]
  const love    = Math.min(100, Math.max(20, base + bonus + (i === j ? -10 : 0) + seeded(i,j,1) * 15))
  const friend  = Math.min(100, Math.max(20, base + bonus + seeded(i,j,2) * 12))
  const work    = Math.min(100, Math.max(20, base + seeded(i,j,3) * 10))
  const overall = Math.round((love + friend + work) / 3)
  return { love: Math.round(love), friend: Math.round(friend), work: Math.round(work), overall }
}

function seeded(a: number, b: number, s: number) {
  return ((a * 7 + b * 13 + s * 3) % 10) / 10
}

export const energyData = [
  [82,65,71,90],[75,88,60,72],[91,70,85,68],[65,55,90,78],
  [88,95,72,85],[70,92,88,65],[95,75,68,82],[72,68,75,95],
  [80,85,70,98],[65,95,82,75],[78,88,65,85],[90,65,95,80],
]

export const dailyTexts = {
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
    "Mars boosts your energy significantly. A perfect time for new beginnings — especially career and personal projects. Trust your instincts.",
    "Venus supports you. Trust your intuition in financial matters, be patient in relationships. A surprise development awaits this weekend.",
    "Mercury elevates your communication. Today is ideal for important conversations. Think both ways, listen to all sides.",
    "The Moon is in your sign — emotions rise to the surface. Face your inner voice, it's time to let go of the past.",
    "The Sun illuminates your sign. Your leadership energy is high, you can motivate your team. A wonderful day for creative projects.",
    "Mercury amplifies your analytical power. Pay attention to details, don't neglect self-care in health matters.",
    "Venus brings balance. Be fair in relationships, make time for art and beauty. Make important decisions this week.",
    "Pluto brings transformative energy. Depth and mystery draw you in. An important financial discovery approaches.",
    "Jupiter increases your luck. Travel and education come to the fore. An opportunity to broaden your horizons is at the door.",
    "Saturn rewards discipline. Focus on long-term goals, take concrete steps in your career. Your efforts won't go to waste.",
    "Uranus brings innovative energy. Step outside the ordinary, connect with technology and community.",
    "Neptune sharpens your intuition. Pay attention to your dreams, spiritual matters come to the forefront.",
  ]
}

export const t = {
  nav: {
    signs: { tr: 'Burçlar', en: 'Signs' },
    chart: { tr: 'Harita', en: 'Chart' },
    compatibility: { tr: 'Uyumluluk', en: 'Compatibility' },
    ai: { tr: 'AI Yorum', en: 'AI Reading' },
    login: { tr: 'Giriş', en: 'Login' },
  },
  hero: {
    tagline: { tr: 'Evrenin seni nasıl şekillendirdiğini keşfet', en: 'Discover how the universe shapes you' },
    sub: { tr: 'Doğum haritandan günlük burç yorumuna, AI destekli kişisel rehberliğe kadar — yıldızların diliyle.', en: 'From your birth chart to daily horoscopes, AI-powered personal guidance — in the language of the stars.' },
    cta1: { tr: 'Haritanı hesapla', en: 'Calculate your chart' },
    cta2: { tr: 'Günlük yorumum', en: 'My daily reading' },
  },
  features: {
    daily: { title: { tr: 'Günlük Yorum', en: 'Daily Reading' }, desc: { tr: 'Her gün güneş doğmadan yenilenen kişisel yorumlar', en: 'Personal readings renewed before sunrise every day' } },
    chart: { title: { tr: 'Doğum Haritası', en: 'Birth Chart' }, desc: { tr: 'Gezegen pozisyonların ve evlerin derinlikli analizi', en: 'In-depth analysis of your planetary positions and houses' } },
    compatibility: { title: { tr: 'Uyumluluk', en: 'Compatibility' }, desc: { tr: 'İki kişinin yıldız haritalarının çok boyutlu analizi', en: 'Multi-dimensional analysis of two birth charts' } },
    ai: { title: { tr: 'AI Astrologun', en: 'AI Astrologer' }, desc: { tr: 'Haritanı anlatan, sorularını yanıtlayan AI rehberin', en: 'Your AI guide that explains your chart and answers questions' } },
  },
  daily: {
    label: { tr: 'GÜNLÜK YORUM', en: 'DAILY READING' },
    today: { tr: 'Bugün', en: 'Today' },
    energy: { tr: ['Aşk', 'Kariyer', 'Sağlık', 'Şans'], en: ['Love', 'Career', 'Health', 'Luck'] },
  },
  ai: {
    label: { tr: 'AI ASTROLOJİ ASISTANIN', en: 'YOUR AI ASTROLOGY ASSISTANT' },
    title: { tr: 'Phoebix AI — Kişisel Astrologun', en: 'Phoebix AI — Your Personal Astrologer' },
    placeholder: { tr: 'Doğum haritam hakkında soru sor...', en: 'Ask about your birth chart...' },
    send: { tr: 'Sor', en: 'Ask' },
    sample: { tr: 'Venüs\'ün şu anki pozisyonu ilişkilerinde yeni bir kapı aralıyor. Yükselen burcunun etkisiyle bu enerjiyi iletişimde kullanabilirsin...', en: 'Venus\'s current position is opening a new door in your relationships. With the influence of your rising sign, you can channel this energy into communication...' },
  },
}
