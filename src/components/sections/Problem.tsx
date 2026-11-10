import { ScrollWordReveal } from '@/components/motion/ScrollWordReveal'
import { useLang } from '@/contexts/LangContext'

export function Problem() {
  const { t } = useLang()
  const before = ['compare.b1', 'compare.b2', 'compare.b3', 'compare.b4'] as const
  const after = ['compare.a1', 'compare.a2', 'compare.a3', 'compare.a4'] as const

  return (
    <section id="probleme" className="nc-statement">
      <div className="nc-wrap">
        <p className="nc-kicker">(01) — {t('problem.eyebrow')}</p>
        <ScrollWordReveal text={t('problem.title')} />
        <p className="nc-lead" style={{ textAlign: 'left', marginTop: 18 }}>{t('problem.lead')}</p>
        <div className="nc-compare">
          <article>
            <h3>{t('compare.before')}</h3>
            {before.map((key) => <p key={key}>{t(key)}</p>)}
          </article>
          <article>
            <h3>{t('compare.after')}</h3>
            {after.map((key) => <p key={key}>{t(key)}</p>)}
          </article>
        </div>
      </div>
    </section>
  )
}
