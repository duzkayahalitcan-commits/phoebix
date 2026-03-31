'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const clr = {
  border: 'rgba(74,53,128,0.3)', purpleLight: '#c4b5f7',
  purpleGlow: '#9d7fe8', muted: '#8b7db5',
}

const NAV_LINKS = [
  { tr: 'Burçlar',    en: 'Signs',         href: '/burclar' },
  { tr: 'Harita',     en: 'Chart',         href: '/dogum-haritasi' },
  { tr: 'Uyumluluk',  en: 'Compatibility', href: '/uyumluluk' },
  { tr: 'AI Yorum',   en: 'AI Reading',    href: '/ai-yorum' },
]

interface Props { lang: 'tr' | 'en'; onLangToggle: () => void }

export default function PageNav({ lang, onLangToggle }: Props) {
  const pathname = usePathname()
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `0.5px solid ${clr.border}`, backdropFilter: 'blur(12px)', background: 'rgba(4,2,14,0.7)' }}>
      <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: '0.25em', color: clr.purpleLight, fontWeight: 400, textDecoration: 'none' }}>
        PHOEBIX
      </Link>
      <div style={{ display: 'flex', gap: 24 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontSize: 13, textDecoration: 'none', transition: 'color 0.2s',
            color: pathname === l.href ? clr.purpleLight : clr.muted,
          }}>
            {lang === 'tr' ? l.tr : l.en}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onLangToggle} style={{ fontSize: 11, padding: '5px 12px', border: `0.5px solid ${clr.border}`, borderRadius: 20, color: clr.muted, background: 'transparent', cursor: 'pointer' }}>
          {lang === 'tr' ? 'TR / EN' : 'EN / TR'}
        </button>
        <Link href="/giris" style={{ fontSize: 12, padding: '6px 16px', border: `0.5px solid rgba(123,94,168,0.4)`, borderRadius: 20, color: clr.purpleGlow, textDecoration: 'none', transition: 'all 0.2s' }}>
          {lang === 'tr' ? 'Giriş' : 'Login'}
        </Link>
      </div>
    </nav>
  )
}
