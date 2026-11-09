import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const ITEMS = [
  ['faq.q1', 'faq.a1'],
  ['faq.q2', 'faq.a2'],
  ['faq.q3', 'faq.a3'],
  ['faq.q4', 'faq.a4'],
  ['faq.q6', 'faq.a6'],
  ['faq.q7', 'faq.a7'],
] as const

export function Faq() {
  const { t } = useLang()

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-sm font-medium text-primary mb-4">{t('faq.eyebrow')}</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-10 max-w-3xl"><Emphasis text={t('faq.title')} /></h2>
        <div className="divide-y divide-border max-w-3xl">
          {ITEMS.map(([q, a]) => (
            <details key={q} className="group px-5 py-4">
              <summary className="cursor-pointer font-medium list-none flex items-center justify-between gap-4">
                {t(q)}
                <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-muted-foreground leading-relaxed pt-3">{t(a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
