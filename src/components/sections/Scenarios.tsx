import { Link } from 'react-router-dom'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'

const ROWS = [
  { id: 'decouverte', image: '/studio/situation-decouverte.jpg' },
  { id: 'essentiel', image: '/studio/situation-essentiel.jpg' },
  { id: 'complet', image: '/studio/situation-complet.jpg' },
] as const

export function Scenarios() {
  const { t, lang } = useLang()

  return (
    <section id="offre" className="nc-work">
      <div className="nc-wrap">
        <Rise>
          <p className="nc-kicker">(02) — {t('tarifs.eyebrow')}</p>
          <h2 id="exemples" className="nc-display">{t('tarifs.eyebrow')}</h2>
          <p className="nc-lead">{t('studio.examplesNote')}</p>
        </Rise>
        <div className="nc-fan" id="tarifs">
          {PACKAGES.map((pkg, index) => {
            const row = ROWS.find((item) => item.id === pkg.id)!
            const fan = index === 0 ? 'is-left' : index === PACKAGES.length - 1 ? 'is-right' : 'is-center'
            return (
              <Rise key={pkg.id} className={`nc-fan-card ${fan} ${pkg.popular ? 'is-pop' : ''}`}>
                <article>
                  <img src={row.image} alt={`${t('studio.example')}, ${t(pkg.nameKey)}`} />
                  <p className="nc-meta">{t('studio.example')} — {pkg.days} {lang === 'fr' ? 'jours' : 'days'}</p>
                  <h3>{t(pkg.nameKey)}</h3>
                  <p className="nc-price">{formatPackagePrice(pkg.price, lang)}</p>
                  <p>{t(pkg.taglineKey)}</p>
                  <ul>
                    {pkg.featureKeys.map((key) => <li key={key}>{t(key)}</li>)}
                  </ul>
                  <Link to={`/options?formule=${pkg.id}`} className="nc-pill is-solid">{t('tarifs.cta')}</Link>
                </article>
              </Rise>
            )
          })}
        </div>
        <div className="nc-notes">
          <p><strong>{t('guarantee.title')}. </strong>{t('guarantee.supplied')}</p>
          <p>{t('tarifs.domain.note')}</p>
        </div>
      </div>
    </section>
  )
}
