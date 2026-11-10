import { useLang } from '@/contexts/LangContext'
import { FitText } from '@/components/motion/FitText'
import { Parallax } from '@/components/motion/Parallax'

export function Hero() {
  const { t } = useLang()

  function scrollNext() {
    document.querySelector('#probleme')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="nc-hero">
      <div className="nc-orb" data-cursor="explore">
        <Parallax dx={-70} dy={-50} rot={6}>
          <img src="/studio/hero-orb.png" alt="" />
        </Parallax>
      </div>
      <div className="nc-hero-inner">
        <h1>
          <Parallax dx={14} dy={4}><FitText text={t('studio.line1')} /></Parallax>
          <Parallax dx={-22} dy={-6}><FitText text={t('studio.line2')} /></Parallax>
          <Parallax dx={30} dy={9}><FitText text={t('studio.line3')} stroke /></Parallax>
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
