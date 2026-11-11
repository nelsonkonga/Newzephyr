import { useLang } from '@/contexts/LangContext'
import { FitText } from '@/components/motion/FitText'

export function Hero() {
  const { t } = useLang()

  return (
    <section id="hero" className="nc-hero">
      <div className="nc-hero-inner">
        <h1>
          <FitText text={t('studio.line1')} />
          <FitText text={t('studio.line2')} />
          <FitText text={t('studio.line3')} stroke />
        </h1>
        <p className="nc-lead">{t('hero.subtitle')}</p>
      </div>
    </section>
  )
}
