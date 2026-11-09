import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function Problem() {
  const { t } = useLang()
  const points = ['problem.p1', 'problem.p2', 'problem.p3']

  return (
    <section id="probleme" className="py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-sm font-medium text-primary mb-4">{t('problem.eyebrow')}</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl"><Emphasis text={t('problem.title')} /></h2>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-2xl">{t('problem.lead')}</p>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {points.map((key, index) => (
            <li key={key}>
              <p className="text-sm font-semibold text-primary mb-3">0{index + 1}</p>
              <p className="text-lg leading-snug">{t(key)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
