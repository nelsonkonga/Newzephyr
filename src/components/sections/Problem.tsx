import { Rise } from '@/components/motion/Rise'
import { ScrollWordReveal } from '@/components/motion/ScrollWordReveal'
import { useLang } from '@/contexts/LangContext'

export function Problem() {
  const { t } = useLang()
  const before = ['compare.b1', 'compare.b2', 'compare.b3', 'compare.b4'] as const
  const after = ['compare.a1', 'compare.a2', 'compare.a3', 'compare.a4'] as const

  return (
    <section id="probleme" className="nc-statement">
      <div className="nc-wrap">
        <Rise>
          <p className="nc-kicker">(01) — {t('problem.eyebrow')}</p>
        </Rise>
        <ScrollWordReveal text={t('problem.title')} />
        <Rise delay={120}>
          <p className="nc-lead" style={{ textAlign: 'left', marginTop: 18 }}>{t('problem.lead')}</p>
        </Rise>
        <div className="nc-compare">
          <article>
            <Rise delay={40}>
              <h3>{t('compare.before')}</h3>
            </Rise>
            {before.map((key, index) => (
              <Rise key={key} delay={110 + index * 70}>
                <p>{t(key)}</p>
              </Rise>
            ))}
          </article>
          <article>
            <Rise delay={90}>
              <h3>{t('compare.after')}</h3>
            </Rise>
            {after.map((key, index) => (
              <Rise key={key} delay={150 + index * 70}>
                <p>{t(key)}</p>
              </Rise>
            ))}
          </article>
        </div>
      </div>
    </section>
  )
}
