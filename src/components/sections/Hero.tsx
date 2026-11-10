import { useLang } from '@/contexts/LangContext'
import { FitText } from '@/components/motion/FitText'
import { Parallax } from '@/components/motion/Parallax'

export function Hero() {
  const { t } = useLang()

  return (
    <section id="hero" className="nc-hero">
      <div className="nc-orb">
        <Parallax dx={-70} dy={-50} rot={6} delay={200}>
          <img src="/studio/hero-orb.png" alt="" />
        </Parallax>
      </div>
      <div className="nc-hero-inner">
        <h1>
          <Parallax dx={14} dy={4} delay={200}><FitText text={t('studio.line1')} /></Parallax>
          <Parallax dx={-22} dy={-6} delay={400}><FitText text={t('studio.line2')} /></Parallax>
          <Parallax dx={30} dy={9} delay={600}><FitText text={t('studio.line3')} stroke /></Parallax>
        </h1>
        <Parallax dx={8} dy={6} delay={820}>
          <p className="nc-lead">{t('hero.subtitle')}</p>
        </Parallax>
      </div>
    </section>
  )
}
