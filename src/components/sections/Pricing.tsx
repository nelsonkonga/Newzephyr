import { Rise } from '@/components/motion/Rise'
import { GlassPlans } from '@/components/sections/GlassPlans'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function Pricing() {
  const { t } = useLang()

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <Rise className="max-w-3xl mb-8">
          <p className="nc-kicker">{t('tarifs.eyebrow')}</p>
          <h2 className="nc-display"><Emphasis text={t('tarifs.title')} /></h2>
          <p className="nc-lead" style={{ textAlign: 'left' }}>{t('tarifs.subtitle')}</p>
        </Rise>
        <p className="max-w-3xl mb-8 text-sm leading-relaxed" style={{ color: 'var(--nc-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--nc-ink)' }}>{t('guarantee.title')}. </span>
          {t('guarantee.supplied')}
        </p>
        <GlassPlans />
        <Rise delay={180}>
          <div className="nc-notes">
            <p>{t('tarifs.domain.note')}</p>
          </div>
        </Rise>
      </div>
    </section>
  )
}
