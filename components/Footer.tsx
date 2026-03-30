'use client'

interface FooterProps { lang: 'tr' | 'en' }

export default function Footer({ lang }: FooterProps) {
  const links = {
    tr: ['Gizlilik', 'Kullanım Koşulları', 'Hakkımızda', 'İletişim'],
    en: ['Privacy', 'Terms of Use', 'About', 'Contact'],
  }
  return (
    <footer className="relative z-10 px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-display text-lg tracking-[0.2em] text-purple-dim">PHOEBIX</div>
      <div className="flex gap-6 flex-wrap justify-center">
        {links[lang].map(l => (
          <span key={l} className="text-xs text-muted/40 hover:text-muted cursor-pointer transition-colors">{l}</span>
        ))}
      </div>
      <div className="text-xs text-muted/30">© 2026 Phoebix</div>
    </footer>
  )
}
