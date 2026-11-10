import { useLang } from '@/contexts/LangContext'

export function Hero() {
  const { t } = useLang()

  function scrollNext() {
    document.querySelector('#probleme')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="nc-hero">
      <img className="nc-orb" src="/studio/hero-orb.png" alt="" />
      <div className="nc-hero-inner">
        <h1>
          <span>{t('studio.line1')}</span>
          <span>{t('studio.line2')}</span>
          <span className="nc-outline">{t('studio.line3')}</span>
        </h1>
        <div className="nc-hero-foot">
          <button type="button" className="nc-scroll" onClick={scrollNext}>
            <b>↓</b>
            {t('studio.scroll')}
          </button>
          <p className="nc-lead">{t('hero.subtitle')}</p>
        </div>
      </div>
    </section>
  )
}
