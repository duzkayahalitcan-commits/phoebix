'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  lang: 'tr' | 'en'
  setLang: (l: 'tr' | 'en') => void
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
    <nav className="relative z-50 flex justify-between items-center px-6 md:px-10 py-5 border-b border-purple-dim/40 backdrop-blur-sm">
      <Link href="/" className="font-display text-2xl tracking-[0.2em] text-purple-light no-underline hover:opacity-80 transition-opacity">
        PHOEBIX
      </Link>

      <div className="hidden md:flex gap-8">
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} className="text-sm text-muted hover:text-purple-light transition-colors no-underline">
            {lang === 'tr' ? l.tr : l.en}
          </Link>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="text-xs px-3 py-1.5 border border-purple-dim/60 rounded-full text-muted hover:text-purple-light hover:border-purple-bright/40 transition-all"
        >
          {lang === 'tr' ? 'TR / EN' : 'EN / TR'}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-purple-dim/60 flex-shrink-0 flex items-center justify-center bg-purple-mid/30 text-purple-light text-xs font-medium">
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden lg:block text-xs text-muted max-w-[120px] truncate">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 border border-purple-dim/60 rounded-full text-muted hover:text-purple-light hover:border-purple-bright/40 transition-all"
            >
              {lang === 'tr' ? 'Çıkış' : 'Logout'}
            </button>
          </div>
        ) : (
          <Link
            href="/giris"
            className="text-xs px-4 py-1.5 border border-purple-dim/60 rounded-full text-purple-glow hover:bg-purple-dim/30 transition-all no-underline"
          >
            {lang === 'tr' ? 'Giriş' : 'Login'}
          </Link>
        )}
      </div>
    </nav>
  )
}
