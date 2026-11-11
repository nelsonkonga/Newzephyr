import { useLang } from '@/contexts/LangContext'

export function Hero() {
  const { t } = useLang()

  return (
    <section id="hero" className="nc-hero">
      <div className="nc-hero-inner">
        <figure className="nc-hero-shot">
          <img src="/studio/hero-desk.jpg" alt={t('hero.visual.alt')} />
          <div className="nc-hero-scrim" aria-hidden="true" />
          <div className="nc-hero-copy">
            <h1>
              <span>{t('studio.line1')}</span>
              <span>{t('studio.line2')}</span>
              <span className="is-thin">{t('studio.line3')}</span>
            </h1>
            <p className="nc-lead">{t('hero.subtitle')}</p>
          </div>
        </figure>
      </div>
    </section>
  )
}
