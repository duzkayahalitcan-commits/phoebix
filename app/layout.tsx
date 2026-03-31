import type { Metadata } from 'next'
import './globals.css'
import NavbarWrapper from '@/components/NavbarWrapper'

export const metadata: Metadata = {
  title: 'Phoebix — Yıldızların Diliyle',
  description: 'Doğum haritanı keşfet, günlük burç yorumun ve AI destekli kişisel astroloji rehberin.',
  keywords: 'astroloji, burç yorumu, doğum haritası, horoscope, astrology',
  openGraph: {
    title: 'Phoebix',
    description: 'Evrenin seni nasıl şekillendirdiğini keşfet.',
    url: 'https://phoebix.com',
    siteName: 'Phoebix',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  )
}
