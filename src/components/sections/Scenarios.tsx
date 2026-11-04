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
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4"><Emphasis text={t('scenarios.title')} /></h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">{t('scenarios.eyebrow')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCENARIOS.map(([kicker, title, body]) => (
            <article key={title} className="rounded-3xl border border-border bg-card p-6 flex flex-col">
              <p className="text-sm font-medium text-primary mb-3">{t(kicker)}</p>
              <h3 className="font-semibold mb-3">{t(title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
