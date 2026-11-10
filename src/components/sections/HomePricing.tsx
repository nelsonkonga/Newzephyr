import { Eyebrow, PlusLink } from '@/components/home/chrome'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'

export function HomePricing() {
  const { t, lang } = useLang()

  return (
    <section id="tarifs" className="nd-packs">
      <div className="nd-pack-head">
        <div>
          <Eyebrow>{t('tarifs.eyebrow')}</Eyebrow>
          <h2 className="nd-giant">
            <i aria-hidden="true">{t('tarifs.eyebrow')}</i>
            {t('tarifs.eyebrow')}
          </h2>
        </div>
      </div>
      <p className="nd-notes" style={{ paddingTop: 0 }}>{t('tarifs.subtitle')}</p>
      <div className="nd-packs-grid">
        {PACKAGES.map((pkg, index) => {
          const price = formatPackagePrice(pkg.price, lang)
          return (
            <article key={pkg.id} className={`nd-pack ${pkg.popular ? 'is-pop' : ''}`}>
              <p className="nd-index">00{index + 1} / {t(pkg.nameKey)}</p>
              <h3>{t(pkg.nameKey)}</h3>
              <p className="nd-price">{price}</p>
              <p>{t(pkg.taglineKey)}</p>
              <p>{t('tarifs.delay').replace('{n}', String(pkg.days))} · {t('tarifs.revisions')}</p>
              {pkg.includedHeaderKey && <p>{t(pkg.includedHeaderKey)}</p>}
              <ul>
                {pkg.featureKeys.map((key) => <li key={key}>{t(key)}</li>)}
              </ul>
              <PlusLink to={`/options?formule=${pkg.id}`} tone={pkg.popular ? 'light' : 'dark'}>
                {t('tarifs.cta')}
              </PlusLink>
            </article>
          )
        })}
      </div>
      <div className="nd-notes">
        <p><strong>{t('guarantee.title')}. </strong>{t('guarantee.supplied')}</p>
        <p>{t('tarifs.domain.note')}</p>
      </div>
    </section>
  )
}
