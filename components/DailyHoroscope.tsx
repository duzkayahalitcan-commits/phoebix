'use client'
import { signs, dailyTexts } from '@/lib/data'

interface DailyProps {
  selected: number
  onSelect: (i: number) => void
  lang: 'tr' | 'en'
}

const energyLabels = {
  tr: ['Aşk', 'Kariyer', 'Sağlık', 'Şans'],
  en: ['Love', 'Career', 'Health', 'Luck'],
}

const energyValues = [
  [82, 65, 71, 90],
  [75, 88, 60, 72],
  [91, 70, 85, 68],
  [65, 55, 90, 78],
  [88, 95, 72, 85],
  [70, 92, 88, 65],
  [95, 75, 68, 82],
  [72, 68, 75, 95],
  [80, 85, 70, 98],
  [65, 95, 82, 75],
  [78, 88, 65, 85],
  [90, 65, 95, 80],
]

export default function DailyHoroscope({ selected, onSelect, lang }: DailyProps) {
  const sign = signs[selected]
  const text = dailyTexts[lang][selected]
  const energy = energyValues[selected]
  const labels = energyLabels[lang]

  const today = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  })

  return (
    <section className="relative z-10 px-6 md:px-10 py-12 border-b border-purple-dim/30">
      <p className="text-xs tracking-[0.25em] text-muted/60 mb-6">
        {lang === 'tr' ? 'GÜNLÜK YORUM' : 'DAILY READING'}
      </p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
        {signs.slice(0, 6).map((s, i) => (
          <button
            key={s.en}
            onClick={() => onSelect(i)}
            className={`p-3 rounded-xl text-center transition-all ${
              selected === i
                ? 'bg-purple-dim/50 border border-purple-bright/40'
                : 'bg-nebula/40 border border-purple-dim/20 hover:border-purple-dim/50'
            }`}
          >
            <div className="text-xl mb-1">{s.symbol}</div>
            <div className="text-xs text-muted">{lang === 'tr' ? s.tr : s.en}</div>
          </button>
        ))}
      </div>

      <div className="card-dark rounded-2xl p-6 md:p-8 max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-display text-xl text-purple-light mb-1">
              {sign.symbol} {lang === 'tr' ? sign.tr : sign.en}
            </div>
            <div className="text-xs text-muted/60">{today}</div>
          </div>
          <span className="text-xs px-2 py-1 bg-nebula border border-purple-dim/40 rounded-full text-muted">
            {lang === 'tr' ? 'Bugün' : 'Today'}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-6">{text}</p>
        <div className="grid grid-cols-4 gap-3">
          {labels.map((label, i) => (
            <div key={label}>
              <div className="text-xs text-muted/60 mb-2">{label}</div>
              <div className="h-1 bg-purple-dim/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-bright/70 rounded-full transition-all duration-700"
                  style={{ width: `${energy[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
