import { Eyebrow, PlusLink } from '@/components/home/chrome'
import { useLang } from '@/contexts/LangContext'

const SCENES = [
  { n: '001', kicker: 'scenarios.s1.kicker', title: 'scenarios.s1.title', body: 'scenarios.s1.body', days: '7', tone: '' },
  { n: '002', kicker: 'scenarios.s2.kicker', title: 'scenarios.s2.title', body: 'scenarios.s2.body', days: '21', tone: 'is-ink' },
  { n: '003', kicker: 'scenarios.s3.kicker', title: 'scenarios.s3.title', body: 'scenarios.s3.body', days: '30', tone: 'is-blue' },
] as const

export function Scenarios() {
  const { t } = useLang()

  return (
    <section id="offre" className="nd-services">
      <div className="nd-sticky" id="exemples">
        <Eyebrow>{t('studio.booking')}</Eyebrow>
        <h2>{t('scenarios.eyebrow')}</h2>
        <p>{t('offer.lead')}</p>
        <PlusLink to="/#tarifs">{t('cta.pricing')}</PlusLink>
      </div>
      <div>
        {SCENES.map((scene) => (
          <article key={scene.n} className="nd-service">
            <div>
              <p className="nd-index">{scene.n} / {t(scene.kicker)}</p>
              <h3>{t(scene.title)}</h3>
              <p>{t(scene.body)}</p>
            </div>
            <div className={`nd-poster ${scene.tone}`}>
              <b>{scene.days}</b>
              <span>{t('tarifs.delay').replace('{n}', scene.days)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
