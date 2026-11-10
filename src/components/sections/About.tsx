import { Link } from 'react-router-dom'
import { Magnetic } from '@/components/motion/Magnetic'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'
import { SOCIAL, whatsappUrl, bookCallMessage } from '@/lib/links'

export function About() {
  const { t, lang } = useLang()

  return (
    <section id="about" className="nc-close">
      <div className="nc-wrap">
        <p className="nc-kicker">(04) — {t('about.eyebrow')}</p>
        <h2>
          {t('studio.talk')}
          <span className="nc-outline" style={{ display: 'block' }}>{t('studio.script')}</span>
        </h2>
        <p className="nc-lead">{t('about.bio')}</p>
        <div className="nc-close-actions">
          <Magnetic>
            <Link to="/appel" className="nc-pill is-solid" onPointerDown={warmCalendly} onFocus={warmCalendly}>
              {t('cta.book')}
            </Link>
          </Magnetic>
          <a className="nc-pill" href={`mailto:${t('studio.mail')}`}>{t('studio.mail')}</a>
          <a className="nc-pill" href={whatsappUrl(bookCallMessage(lang))}>WhatsApp</a>
          <a className="nc-pill" href={SOCIAL.instagram}>Instagram</a>
        </div>
      </div>
    </section>
  )
}
