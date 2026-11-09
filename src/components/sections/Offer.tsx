import { Rise } from '@/components/motion/Rise'
import { CalendarClock, Globe, PenLine, Wallet } from 'lucide-react'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const BENEFITS = [
  [Globe, 'offer.b1.title', 'offer.b1.desc'],
  [CalendarClock, 'offer.b2.title', 'offer.b2.desc'],
  [PenLine, 'offer.b3.title', 'offer.b3.desc'],
  [Wallet, 'offer.b4.title', 'offer.b4.desc'],
] as const

const FACTS = ['offer.forWho', 'offer.result', 'offer.how'] as const

export function Offer() {
  const { t } = useLang()

  return (
    <section id="offre" className="py-20 sm:py-28 bg-muted/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-sm font-medium text-primary mb-4">{t('offer.eyebrow')}</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl"><Emphasis text={t('offer.title')} /></h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">{t('offer.lead')}</p>

        <Rise>
        <dl className="mt-14 grid gap-10 sm:grid-cols-3">
          {FACTS.map((key) => (
            <div key={key}>
              <dt className="text-sm font-medium text-primary mb-2">{t(key)}</dt>
              <dd className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">{t(`${key}.value`)}</dd>
            </div>
          ))}
        </dl>
        </Rise>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(([Icon, title, desc]) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t(title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
