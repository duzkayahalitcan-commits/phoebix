'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarBg from '@/components/StarBg'
import { supabase } from '@/lib/supabase'

const clr = {
  bg: '#04020e', nebula: '#0f0920', border: 'rgba(74,53,128,0.3)',
  purple: '#7b5ea8', purpleLight: '#c4b5f7', purpleGlow: '#9d7fe8',
  muted: '#8b7db5', mutedDim: '#5a4d80', star: '#f0ebff',
}

export default function Giris() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Email ve şifre zorunlu'); return }
    setLoading(true); setError(''); setMessage('')
    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) setError(error.message)
      else setMessage('Kayıt başarılı! Email kutunuzu kontrol edin.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email veya şifre hatalı')
      else window.location.href = '/'
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(4,2,14,0.8)', border: `0.5px solid ${clr.border}`,
    borderRadius: 10, padding: '11px 14px', fontSize: 14, color: clr.star, fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  }

  return (
    <>
      <StarBg />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: clr.star, padding: '24px' }}>

        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: '0.25em', color: clr.purpleLight, textDecoration: 'none', marginBottom: 48 }}>
          PHOEBIX
        </Link>

        <div style={{ width: '100%', maxWidth: 400, background: 'rgba(15,9,32,0.85)', border: `0.5px solid ${clr.border}`, borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(16px)', animation: 'fadeUp 0.5s ease forwards' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'rgba(4,2,14,0.6)', borderRadius: 12, padding: 4 }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', border: 'none', fontFamily: "'DM Sans', sans-serif",
                background: mode === m ? clr.purple : 'transparent',
                color: mode === m ? clr.star : clr.muted,
              }}>
                {m === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 12, color: clr.mutedDim, marginBottom: 6, display: 'block' }}>Ad Soyad</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Adınız" style={inp} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: clr.mutedDim, marginBottom: 6, display: 'block' }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ornek@mail.com" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: clr.mutedDim, marginBottom: 6, display: 'block' }}>Şifre</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inp} />
            </div>
          </div>

          {error   && <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)', borderRadius: 8, fontSize: 13, color: '#f09595' }}>{error}</div>}
          {message && <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 8, fontSize: 13, color: '#5DCAA5' }}>{message}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', marginTop: 24, padding: '13px 0',
            background: loading ? 'rgba(123,94,168,0.4)' : clr.purple,
            border: 'none', borderRadius: 12, color: clr.star, fontSize: 14, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
          }}>
            {loading ? 'Yükleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: clr.border }} />
            <span style={{ fontSize: 12, color: clr.mutedDim }}>veya</span>
            <div style={{ flex: 1, height: '0.5px', background: clr.border }} />
          </div>

          <button onClick={async () => {
            await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.phoebix.com/auth/callback' } })
          }} style={{
            width: '100%', padding: '12px 0', background: 'transparent', border: `0.5px solid ${clr.border}`,
            borderRadius: 12, color: clr.muted, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile devam et
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: clr.mutedDim }}>
            {mode === 'login' ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
              style={{ color: clr.purpleGlow, cursor: 'pointer' }}>
              {mode === 'login' ? 'Kayıt ol' : 'Giriş yap'}
            </span>
          </p>
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: clr.mutedDim }}>
          <Link href="/" style={{ color: clr.mutedDim, textDecoration: 'underline' }}>← Ana sayfaya dön</Link>
        </p>
      </div>
    </>
  )
}
