import { Link } from 'react-router-dom'
import { Magnetic } from '@/components/motion/Magnetic'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'

export function About() {
  const { t } = useLang()

  return (
    <section id="about" className="nc-close">
      <div className="nc-wrap">
        <Rise>
          <p className="nc-kicker">(04) — {t('about.eyebrow')}</p>
        </Rise>
        <Rise delay={100}>
          <h2>
            {t('studio.talk')}
            <span className="nc-outline" style={{ display: 'block' }}>{t('studio.script')}</span>
          </h2>
        </Rise>
        <Rise delay={180}>
          <p className="nc-lead">{t('about.bio')}</p>
        </Rise>
        <Rise delay={260}>
          <div className="nc-close-actions">
            <Magnetic>
              <Link to="/appel" className="nc-pill is-solid nc-cta" onPointerDown={warmCalendly} onFocus={warmCalendly}>
                {t('cta.book')}
              </Link>
            </Magnetic>
          </div>
        </Rise>
      </div>
    </section>
  )
}
