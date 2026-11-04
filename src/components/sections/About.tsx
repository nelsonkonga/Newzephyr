import { MapPin } from 'lucide-react'
import { useLang } from '@/contexts/LangContext'

export function About() {
  const { t } = useLang()
  const points = ['about.h1', 'about.h2', 'about.h3']

  return (
    <section id="about" className="py-20 sm:py-28 bg-muted/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-md">
            <img
              src="/nelo-profile.jpg"
              alt="Nelson, Newzephyr"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">{t('about.eyebrow')}</p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-2">{t('about.title')}</h2>
            <p className="text-lg text-muted-foreground mb-3">{t('about.role')}</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              {t('about.location')}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">{t('about.bio')}</p>
            <ul className="space-y-2 mb-6">
              {points.map((key) => (
                <li key={key} className="text-sm flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t('about.available')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
