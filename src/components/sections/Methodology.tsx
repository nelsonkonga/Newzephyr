import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const STEPS = [
  ['01', 'method.s1.title', 'method.s1.desc'],
  ['02', 'method.s2.title', 'method.s2.desc'],
  ['03', 'method.s3.title', 'method.s3.desc'],
  ['04', 'method.s4.title', 'method.s4.desc'],
] as const

export function Methodology() {
  const { t } = useLang()

  return (
    <section id="methode" className="py-20 sm:py-28">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4"><Emphasis text={t('method.title')} /></h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-14">{t('method.subtitle')}</p>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map(([number, title, desc]) => (
            <li key={number} className="rounded-3xl border border-border bg-card p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-medium text-primary mb-4">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {number}
              </p>
              <h3 className="text-2xl font-semibold mb-3">{t(title)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
