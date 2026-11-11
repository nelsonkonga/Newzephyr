import { Rise } from '@/components/motion/Rise'
import { GlassPlans } from '@/components/sections/GlassPlans'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function Scenarios() {
  const { t } = useLang()

  return (
    <section id="offre" className="nc-work">
      <div className="nc-wrap">
        <Rise>
          <p className="nc-kicker">(02) — {t('tarifs.eyebrow')}</p>
        </Rise>
        <Rise delay={90}>
          <h2 id="exemples" className="nc-display"><Emphasis text={t('tarifs.title')} /></h2>
        </Rise>
        <Rise delay={160}>
          <p className="nc-lead">{t('tarifs.subtitle')}</p>
        </Rise>
        <GlassPlans />
        <Rise>
          <div className="nc-notes">
            <p><strong>{t('guarantee.title')}. </strong>{t('guarantee.supplied')}</p>
            <p>{t('tarifs.domain.note')}</p>
          </div>
        </Rise>
      </div>
    </section>
  )
}
