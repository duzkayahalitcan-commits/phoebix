'use client'

interface NavbarProps {
  lang: 'tr' | 'en'
  setLang: (l: 'tr' | 'en') => void
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const links = {
    tr: ['Burçlar', 'Harita', 'Uyumluluk', 'AI Yorum'],
    en: ['Signs', 'Chart', 'Compatibility', 'AI Reading'],
  }

  return (
    <nav className="relative z-50 flex justify-between items-center px-6 md:px-10 py-5 border-b border-purple-dim/40">
      <div className="font-display text-2xl tracking-[0.2em] text-purple-light">
        PHOEBIX
      </div>
      <div className="hidden md:flex gap-8">
        {links[lang].map((l) => (
          <span key={l} className="text-sm text-muted hover:text-purple-light transition-colors cursor-pointer">
            {l}
          </span>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="text-xs px-3 py-1.5 border border-purple-dim/60 rounded-full text-muted hover:text-purple-light hover:border-purple-bright/40 transition-all"
        >
          {lang === 'tr' ? 'TR / EN' : 'EN / TR'}
        </button>
        <button className="text-xs px-4 py-1.5 border border-purple-dim/60 rounded-full text-purple-glow hover:bg-purple-dim/30 transition-all">
          {lang === 'tr' ? 'Giriş' : 'Login'}
        </button>
      </div>
    </nav>
  )
}
