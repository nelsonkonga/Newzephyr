import { Link } from 'react-router-dom'
import { LineField } from '@/components/home/LineField'
import { Count, Marquee, useInView } from '@/components/home/chrome'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'

export function Hero() {
  const { t, lang } = useLang()
  const ribbon = lang === 'fr'
    ? ['Découverte', '7 jours', 'Essentiel', '21 jours', 'Complet', '30 jours', '449 €', '990 €', '2 990 €']
    : ['Discovery', '7 days', 'Essential', '21 days', 'Complete', '30 days', '€449', '€990', '€2,990']
  const [side, seen] = useInView<HTMLDivElement>()

  function scrollToPricing() {
    document.querySelector('#tarifs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="nd-hero">
      <LineField />
      <div className="nd-hero-body">
        <div>
          <p className="nd-kicker">{t('hero.badge')}</p>
          <p className="nd-word" aria-hidden="true">Newzephyr</p>
          <h1><Emphasis text={t('hero.title')} /></h1>
          <p className="nd-script">{t('studio.script')}</p>
          <p className="nd-lead">{t('hero.subtitle')}</p>
          <div className="nd-hero-actions">
            <button type="button" className="nd-plus is-light" onClick={scrollToPricing}>
              <span>{t('cta.pricing')}</span>
              <b>+</b>
            </button>
            <Link to="/appel" className="nd-textlink" onPointerDown={warmCalendly} onFocus={warmCalendly}>
              {t('cta.book')}
            </Link>
          </div>
          <ul className="nd-trust">
            <li>{t('hero.trust1')}</li>
            <li>{t('hero.trust2')}</li>
            <li>{t('hero.trust3')}</li>
          </ul>
        </div>
        <div className="nd-hero-side" ref={side}>
          <strong><Count to={7} on={seen} /></strong>
          <span>{t('hero.visual.delay')}</span>
          <em>{t('hero.visual.from')}</em>
        </div>
      </div>
      <Marquee items={ribbon} />
    </section>
  )
}
