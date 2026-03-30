'use client'
import { signs } from '@/lib/data'

interface SignStripProps {
  selected: number
  onSelect: (i: number) => void
  lang: 'tr' | 'en'
}

export default function SignStrip({ selected, onSelect, lang }: SignStripProps) {
  return (
    <div className="relative z-10 flex flex-wrap justify-center gap-2 px-6 py-5 border-y border-purple-dim/30">
      {signs.map((s, i) => (
        <button
          key={s.en}
          onClick={() => onSelect(i)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            selected === i
              ? 'border border-purple-bright/60 text-purple-light bg-purple-dim/30'
              : 'border border-purple-dim/30 text-muted hover:text-purple-light hover:border-purple-dim/60'
          }`}
        >
          {s.symbol} {lang === 'tr' ? s.tr : s.en}
        </button>
      ))}
    </div>
  )
}
