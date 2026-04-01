'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  lang: 'tr' | 'en'
  setLang: (l: 'tr' | 'en') => void
}

const clr = {
  border: 'rgba(42,31,74,0.4)',
  borderDim: 'rgba(42,31,74,0.6)',
  purple: '#7b5ea8',
  purpleLight: '#c4b5f7',
  purpleGlow: '#9d7fe8',
  purpleMid: 'rgba(74,53,128,0.3)',
  muted: '#8b7db5',
  bg: 'rgba(4,2,14,0.85)',
}

const NAV_LINKS = [
  { tr: 'Burçlar',   en: 'Signs',         href: '/burclar' },
  { tr: 'Harita',    en: 'Chart',         href: '/dogum-haritasi' },
  { tr: 'Uyumluluk', en: 'Compatibility', href: '/uyumluluk' },
  { tr: 'AI Yorum',  en: 'AI Reading',    href: '/ai-yorum' },
]

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const displayName = user?.user_metadata?.name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || ''

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <nav style={{
      position: 'relative',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 40px',
      borderBottom: `0.5px solid ${clr.border}`,
      backdropFilter: 'blur(10px)',
      background: clr.bg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* Logo */}
      <Link href="/" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22,
        letterSpacing: '0.22em',
        color: clr.purpleLight,
        textDecoration: 'none',
        fontWeight: 400,
      }}>
        PHOEBIX
      </Link>

      {/* Nav links (hidden on small screens via inline media trick — always rendered for SSR) */}
      <div style={{ display: 'flex', gap: 28 }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontSize: 13,
            color: clr.muted,
            textDecoration: 'none',
          }} className="nl">
            {lang === 'tr' ? l.tr : l.en}
          </Link>
        ))}
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          style={{
            fontSize: 11,
            padding: '5px 12px',
            border: `0.5px solid ${clr.borderDim}`,
            borderRadius: 20,
            color: clr.muted,
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          {lang === 'tr' ? 'TR / EN' : 'EN / TR'}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `0.5px solid ${clr.borderDim}`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: clr.purpleMid,
              color: clr.purpleLight,
              fontSize: 12,
              fontWeight: 500,
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                : displayName.charAt(0).toUpperCase()}
            </div>
            <span style={{
              fontSize: 12,
              color: clr.muted,
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: 11,
                padding: '5px 12px',
                border: `0.5px solid ${clr.borderDim}`,
                borderRadius: 20,
                color: clr.muted,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {lang === 'tr' ? 'Çıkış' : 'Logout'}
            </button>
          </div>
        ) : (
          <Link href="/giris" style={{
            fontSize: 12,
            padding: '6px 16px',
            border: `0.5px solid rgba(123,94,168,0.4)`,
            borderRadius: 20,
            color: clr.purpleGlow,
            background: 'transparent',
            textDecoration: 'none',
          }}>
            {lang === 'tr' ? 'Giriş' : 'Login'}
          </Link>
        )}
      </div>
    </nav>
  )
}
