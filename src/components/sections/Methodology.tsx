import { Rise } from '@/components/motion/Rise'
import { MethodTunnel } from '@/components/sections/MethodTunnel'
import { useLang } from '@/contexts/LangContext'

export function Methodology() {
  const { t, lang } = useLang()
  const ribbon = lang === 'fr'
    ? ['Salon', 'Restaurant', 'Hôtel', 'Boutique', 'Atelier', 'Cabinet', 'Toute activité']
    : ['Salon', 'Restaurant', 'Hotel', 'Shop', 'Studio', 'Practice', 'Any activity']
  const line = [...ribbon, ...ribbon]

  return (
    <section id="methode" className="nc-steps">
      <div className="nc-wrap">
        <Rise>
          <p className="nc-kicker">(03) — {t('method.eyebrow')}</p>
        </Rise>
        <Rise delay={80}>
          <h2 className="nc-display">{t('method.eyebrow')}</h2>
        </Rise>
        <Rise delay={150}>
          <p className="nc-lead" style={{ textAlign: 'left', margin: '14px 0 8px' }}>{t('method.subtitle')}</p>
        </Rise>
      </div>
      <MethodTunnel />
      <div className="nc-wrap">
        <Rise delay={80}>
          <p className="nc-kicker" style={{ marginTop: 36 }}>{t('offer.forWho.value')}</p>
        </Rise>
        <div className="nc-marquee" aria-hidden="true">
          <div className="nc-marquee-track">
            {line.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
