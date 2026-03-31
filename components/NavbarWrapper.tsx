'use client'

import { useState } from 'react'
import Navbar from './Navbar'

export default function NavbarWrapper() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')
  return <Navbar lang={lang} setLang={setLang} />
}
