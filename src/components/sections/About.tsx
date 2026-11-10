import { PlusLink } from '@/components/home/chrome'
import { useLang } from '@/contexts/LangContext'
import { SOCIAL, whatsappUrl, bookCallMessage } from '@/lib/links'

export function About() {
  const { t, lang } = useLang()

  return (
    <section id="about" className="nd-dark">
      <div className="nd-close">
        <img className="nd-close-photo" src="/nelo-profile.jpg" alt="Nelson, Newzephyr" />
        <div>
          <p className="nd-kicker">{t('about.eyebrow')}</p>
          <h2>{t('studio.talk')}</h2>
          <p className="nd-lead">{t('about.bio')}</p>
          <div className="nd-hero-actions">
            <PlusLink to="/appel" tone="light">{t('cta.book')}</PlusLink>
          </div>
          <div className="nd-close-meta">
            <p><a href={`mailto:${t('studio.mail')}`}>{t('studio.mail')}</a></p>
            <p><a href={whatsappUrl(bookCallMessage(lang))}>WhatsApp</a></p>
            <p>{t('about.location')} · {t('about.available')}</p>
            <p>
              <a href={SOCIAL.instagram}>Instagram</a>
              {' · '}
              <a href={SOCIAL.linkedin}>LinkedIn</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
