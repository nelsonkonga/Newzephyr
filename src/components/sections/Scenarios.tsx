import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LiquidImage } from '@/components/motion/LiquidImage'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'

const ROWS = [
  { id: 'decouverte', image: '/studio/situation-decouverte.jpg', title: 'scenarios.s1.title', body: 'scenarios.s1.body' },
  { id: 'essentiel', image: '/studio/situation-essentiel.jpg', title: 'scenarios.s2.title', body: 'scenarios.s2.body' },
  { id: 'complet', image: '/studio/situation-complet.jpg', title: 'scenarios.s3.title', body: 'scenarios.s3.body' },
] as const

export function Scenarios() {
  const { t, lang } = useLang()
  const [visit, setVisit] = useState(false)

  return (
    <section id="offre" className="nc-work">
      <div className="nc-wrap">
        <div className="nc-work-head">
          <div>
            <p className="nc-kicker">(02) — {t('studio.examples')}</p>
            <h2 id="exemples" className="nc-display">{t('studio.examples')}</h2>
            <p>{t('studio.examplesNote')}</p>
          </div>
          <div className="nc-switch" role="group" aria-label={t('tarifs.mode.label')}>
            <button type="button" aria-pressed={!visit} onClick={() => setVisit(false)}>{t('tarifs.mode.supplied')}</button>
            <button type="button" aria-pressed={visit} onClick={() => setVisit(true)}>{t('tarifs.mode.visit')}</button>
          </div>
        </div>
        {ROWS.map((row, index) => {
          const pkg = PACKAGES.find((item) => item.id === row.id)!
          const price = formatPackagePrice(visit ? pkg.visitPrice : pkg.price, lang)
          const other = formatPackagePrice(visit ? pkg.price : pkg.visitPrice, lang)
          const otherLabel = visit ? t('tarifs.mode.supplied') : t('tarifs.mode.visit')
          return (
            <article key={row.id} id={row.id === 'decouverte' ? 'tarifs' : undefined} className={`nc-row ${index % 2 ? 'is-flip' : ''}`}>
              <LiquidImage src={row.image} alt={`${t('studio.example')}, ${t(pkg.nameKey)}`} />
              <div>
                <p className="nc-meta">{t('studio.example')} — {t(pkg.nameKey)} — {pkg.days} {lang === 'fr' ? 'jours' : 'days'}</p>
                <h3>{t(row.title)}</h3>
                <p>{t(row.body)}</p>
                <p className="nc-price">{price}</p>
                <p>{otherLabel} : {other}</p>
                <div className="nc-pills">
                  {pkg.featureKeys.map((key) => <span key={key}>{t(key)}</span>)}
                </div>
                <Link to={`/options?formule=${pkg.id}`} className="nc-pill is-solid" style={{ marginTop: 18 }}>
                  {t('tarifs.cta')}
                </Link>
              </div>
            </article>
          )
        })}
        <div className="nc-notes">
          <p><strong>{t('guarantee.title')}. </strong>{t('guarantee.supplied')}</p>
          <p>{t('tarifs.domain.note')}</p>
          <p>{t('tarifs.visit.yaounde')}</p>
          <p>{t('tarifs.visit.outside')}</p>
        </div>
      </div>
    </section>
  )
}
