import { Eyebrow } from '@/components/home/chrome'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function Problem() {
  const { t } = useLang()
  const points = ['problem.p1', 'problem.p2', 'problem.p3'] as const

  return (
    <section id="probleme" className="nd-who">
      <Eyebrow>Newzephyr — {t('problem.eyebrow')}</Eyebrow>
      <h2><Emphasis text={t('problem.title')} /></h2>
      <div className="nd-who-grid">
        <img className="nd-who-photo" src="/nelo-profile.jpg" alt="Nelson, Newzephyr" />
        <div className="nd-who-copy">
          <p>{t('problem.lead')}</p>
          <ul className="nd-who-list">
            {points.map((key) => <li key={key}>{t(key)}</li>)}
          </ul>
          <div className="nd-quote">
            <img src="/nelo-profile.jpg" alt="" />
            <div>
              <strong>Nelson</strong>
              <span>{t('about.location')}</span>
            </div>
          </div>
          <p style={{ marginTop: 14 }}>{t('about.bio')}</p>
        </div>
        <div className="nd-who-panel">
          <p className="nd-script">{t('studio.script')}</p>
          <strong>449 €</strong>
          <span>{t('tarifs.delay').replace('{n}', '7')}</span>
          <p style={{ marginTop: 18 }}>{t('offer.b4.desc')}</p>
        </div>
      </div>
    </section>
  )
}
