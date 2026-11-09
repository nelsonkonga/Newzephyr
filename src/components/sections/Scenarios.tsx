import { Rise } from '@/components/motion/Rise'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const SCENARIOS = [
  ['scenarios.s1.kicker', 'scenarios.s1.title', 'scenarios.s1.body'],
  ['scenarios.s2.kicker', 'scenarios.s2.title', 'scenarios.s2.body'],
  ['scenarios.s3.kicker', 'scenarios.s3.title', 'scenarios.s3.body'],
] as const

export function Scenarios() {
  const { t } = useLang()

  return (
    <section id="exemples" className="py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl"><Emphasis text={t('scenarios.title')} /></h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t('scenarios.eyebrow')}</p>
        <div className="mt-16 space-y-20 sm:space-y-28">
          {SCENARIOS.map(([kicker, title, body], index) => (
            <article key={title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Rise className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <Scene index={index} />
              </Rise>
              <div>
                <p className="text-sm font-medium text-primary mb-3">{t(kicker)}</p>
                <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4">{t(title)}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{t(body)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Scene({ index }: { index: number }) {
  return (
    <div className={`zephyr-device ${index % 2 === 1 ? 'zephyr-device-right' : ''}`}>
    <div className="zephyr-scene" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-3 h-6 flex-1 rounded-full bg-muted" />
      </div>
      {index === 0 && <Gallery />}
      {index === 1 && <Request />}
      {index === 2 && <Payment />}
    </div>
    </div>
  )
}

function Gallery() {
  return (
    <div className="px-5 pb-6">
      <div className="h-3 w-28 rounded-full bg-foreground/80" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-24 rounded-2xl bg-primary/20" />
        <div className="h-24 rounded-2xl bg-primary/40" />
        <div className="h-24 rounded-2xl bg-gold/50" />
      </div>
      <div className="mt-4 h-10 w-36 rounded-full bg-primary" />
    </div>
  )
}

function Request() {
  return (
    <div className="px-5 pb-6">
      <div className="flex gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">FR</span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">EN</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <span className="rounded-xl bg-primary/15 px-2 py-3 text-center text-xs font-semibold text-primary">10:00</span>
        <span className="rounded-xl bg-primary px-2 py-3 text-center text-xs font-semibold text-primary-foreground">14:30</span>
        <span className="rounded-xl bg-muted px-2 py-3 text-center text-xs font-semibold">18:00</span>
      </div>
      <div className="mt-4 h-16 rounded-2xl bg-muted" />
      <div className="mt-3 h-10 rounded-full bg-primary" />
    </div>
  )
}

function Payment() {
  return (
    <div className="px-5 pb-6">
      <p className="text-3xl font-semibold tracking-tight">449 €</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-14 rounded-2xl bg-primary/15" />
        <div className="h-14 rounded-2xl bg-foreground/90" />
      </div>
      <div className="mt-4 h-11 rounded-full bg-primary" />
    </div>
  )
}
