import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Rise } from '@/components/motion/Rise'
import { Emphasis } from '@/components/ui/Emphasis'
import { Button } from '@/components/ui/button'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'

export function Pricing() {
  const { t, lang } = useLang()

  return (
    <section id="tarifs" className="py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <Rise className="max-w-3xl mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-3">{t('tarifs.eyebrow')}</p>
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-4"><Emphasis text={t('tarifs.title')} /></h2>
          <p className="text-muted-foreground leading-relaxed">{t('tarifs.subtitle')}</p>
        </Rise>

        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{t('guarantee.title')}. </span>
          {t('guarantee.supplied')}
        </p>

        <div className="zephyr-fan grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-stretch mb-8 pt-4 lg:px-3 lg:pt-12 lg:pb-14">
          {PACKAGES.map((pkg, index) => {
            const name = t(pkg.nameKey)
            const price = formatPackagePrice(pkg.price, lang)
            const optionsUrl = `/options?formule=${pkg.id}`
            const fan = index === 0 ? 'zephyr-fan-left' : index === PACKAGES.length - 1 ? 'zephyr-fan-right' : 'zephyr-fan-center'
            return (
              <Rise key={pkg.id} className="h-full">
              <article
                className={`zephyr-fan-card ${fan} relative rounded-3xl flex flex-col h-full bg-card p-6 sm:p-8 ${
                  pkg.popular
                    ? 'border-2 border-primary shadow-xl'
                    : 'border border-border'
                }`}
              >
                {pkg.popular && pkg.popularBadgeKey && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      {t(pkg.popularBadgeKey)}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{name}</h3>
                <p className="text-4xl font-extrabold tracking-tight mb-4">{price}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[60px]">{t(pkg.taglineKey)}</p>

                <Button
                  variant={pkg.popular ? 'default' : 'outline'}
                  className={`w-full h-12 rounded-[10px] mb-6 ${pkg.popular ? '' : 'border-primary text-primary hover:bg-primary/5 hover:text-primary'}`}
                  asChild
                >
                  <Link to={optionsUrl}>
                    {t('tarifs.cta')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-sm font-medium mb-1">{t('tarifs.delay').replace('{n}', String(pkg.days))}</p>
                <p className="text-sm text-muted-foreground mb-6">{t('tarifs.revisions')}</p>

                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">{t('tarifs.includedTitle')}</p>
                {pkg.includedHeaderKey && (
                  <p className="text-xs font-medium mb-3">{t(pkg.includedHeaderKey)}</p>
                )}
                <ul className="space-y-3 flex-1">
                  {pkg.featureKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </article>
              </Rise>
            )
          })}
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-sm">{t('tarifs.domain.note')}</p>
        </div>

      </div>
    </section>
  )
}
