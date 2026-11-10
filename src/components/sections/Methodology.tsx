import { useLang } from '@/contexts/LangContext'

const STEPS = [
  ['01', 'method.s1.title', 'method.s1.desc', '/studio/step-call.jpg'],
  ['02', 'method.s2.title', 'method.s2.desc', '/studio/step-deposit.jpg'],
  ['03', 'method.s3.title', 'method.s3.desc', '/studio/step-delivery.jpg'],
  ['04', 'method.s4.title', 'method.s4.desc', '/studio/step-live.jpg'],
] as const

export function Methodology() {
  const { t, lang } = useLang()
  const ribbon = lang === 'fr'
    ? ['Salon', 'Restaurant', 'Hôtel', 'Boutique', 'Atelier', 'Cabinet', 'Toute activité']
    : ['Salon', 'Restaurant', 'Hotel', 'Shop', 'Studio', 'Practice', 'Any activity']
  const line = [...ribbon, ...ribbon]

  return (
    <section id="methode" className="nc-steps">
      <div className="nc-wrap">
        <p className="nc-kicker">(03) — {t('method.eyebrow')}</p>
        <h2 className="nc-display">{t('method.eyebrow')}</h2>
        <p className="nc-lead" style={{ textAlign: 'left', margin: '14px 0 8px' }}>{t('method.subtitle')}</p>
        {STEPS.map(([n, title, desc, image]) => (
          <article key={n} className="nc-step">
            <b>{n}</b>
            <h3>{t(title)}</h3>
            <p>{t(desc)}</p>
            <img src={image} alt="" />
          </article>
        ))}
        <p className="nc-kicker" style={{ marginTop: 36 }}>{t('offer.forWho.value')}</p>
        <div className="nc-marquee" aria-hidden="true">
          <div className="nc-marquee-track">
            {line.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
