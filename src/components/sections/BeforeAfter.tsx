import { ArrowRight } from 'lucide-react'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const ROWS = [
  ['compare.b1', 'compare.a1'],
  ['compare.b2', 'compare.a2'],
  ['compare.b3', 'compare.a3'],
  ['compare.b4', 'compare.a4'],
] as const

export function BeforeAfter() {
  const { t, lang } = useLang()
  const classicPrice = lang === 'fr' ? '3 000 €' : '€3,000'
  const writtenPrice = lang === 'fr' ? '449 €' : '€449'

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-sm font-medium text-primary mb-4">{t('compare.eyebrow')}</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl mb-14"><Emphasis text={t('compare.title')} /></h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">{t('compare.before')}</p>
            <p className="text-5xl sm:text-7xl font-semibold tracking-tight text-muted-foreground line-through decoration-foreground/25">{classicPrice}</p>
            <ul className="mt-8 space-y-4">
              {ROWS.map(([before]) => (
                <li key={before} className="text-lg text-muted-foreground">{t(before)}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-primary mb-3">{t('compare.after')}</p>
            <p className="text-5xl sm:text-7xl font-semibold tracking-tight text-primary">{writtenPrice}</p>
            <ul className="mt-8 space-y-4">
              {ROWS.map(([, after]) => (
                <li key={after} className="text-lg">{t(after)}</li>
              ))}
            </ul>
            <a
              href="#tarifs"
              className="mt-10 inline-flex items-center h-14 rounded-full bg-primary text-primary-foreground pl-6 pr-2 text-base font-semibold"
            >
              {t('cta.pricing')}
              <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
