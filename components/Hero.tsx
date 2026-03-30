'use client'

interface HeroProps { lang: 'tr' | 'en' }

export default function Hero({ lang }: HeroProps) {
  const content = {
    tr: {
      tagline: 'Evrenin seni nasıl şekillendirdiğini keşfet',
      sub: 'Doğum haritandan günlük burç yorumuna, AI destekli kişisel rehberliğe kadar — yıldızların diliyle.',
      cta1: 'Haritanı hesapla',
      cta2: 'Günlük yorumum',
    },
    en: {
      tagline: 'Discover how the universe shapes you',
      sub: 'From your birth chart to daily horoscopes, AI-powered personal guidance — in the language of the stars.',
      cta1: 'Calculate your chart',
      cta2: 'My daily reading',
    },
  }
  const c = content[lang]

  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 py-24 md:py-32">
      <div className="flex gap-4 mb-8 text-purple-dim text-xs tracking-[0.4em]">
        <span>✦</span><span>✦</span><span>✦</span>
      </div>
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 max-w-3xl">
        <span className="text-star">{c.tagline.split(' ').slice(0, -2).join(' ')}</span>{' '}
        <span className="text-gradient italic">{c.tagline.split(' ').slice(-2).join(' ')}</span>
      </h1>
      <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed mb-10">
        {c.sub}
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="px-7 py-3 bg-purple-bright/80 hover:bg-purple-bright text-star text-sm rounded-full transition-all hover:scale-105">
          {c.cta1}
        </button>
        <button className="px-7 py-3 border border-purple-dim/60 hover:border-purple-bright/50 text-muted hover:text-purple-light text-sm rounded-full transition-all">
          {c.cta2}
        </button>
      </div>
    </section>
  )
}
