'use client'

interface FeaturesProps { lang: 'tr' | 'en' }

const features = {
  tr: [
    { icon: '☀', title: 'Günlük Yorum', desc: 'Her gün güneş doğmadan yenilenen kişisel yorumlar' },
    { icon: '◎', title: 'Doğum Haritası', desc: 'Gezegen pozisyonların ve evlerin derinlikli analizi' },
    { icon: '♡', title: 'Uyumluluk', desc: 'İki kişinin yıldız haritalarının çok boyutlu analizi' },
    { icon: '✦', title: 'AI Astrologun', desc: 'Haritanı anlatan, sorularını yanıtlayan AI rehberin' },
  ],
  en: [
    { icon: '☀', title: 'Daily Reading', desc: 'Personal readings renewed before sunrise every day' },
    { icon: '◎', title: 'Birth Chart', desc: 'In-depth analysis of your planetary positions and houses' },
    { icon: '♡', title: 'Compatibility', desc: 'Multi-dimensional analysis of two birth charts' },
    { icon: '✦', title: 'AI Astrologer', desc: 'Your AI guide that explains your chart and answers questions' },
  ],
}

export default function Features({ lang }: FeaturesProps) {
  return (
    <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-purple-dim/30 border-y border-purple-dim/30">
      {features[lang].map((f) => (
        <div key={f.title} className="p-6 md:p-8 group cursor-pointer hover:bg-nebula/50 transition-colors">
          <div className="w-9 h-9 mb-4 rounded-lg bg-nebula border border-purple-dim/50 flex items-center justify-center text-purple-glow text-base">
            {f.icon}
          </div>
          <h3 className="text-sm font-medium text-purple-light mb-2">{f.title}</h3>
          <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </section>
  )
}
