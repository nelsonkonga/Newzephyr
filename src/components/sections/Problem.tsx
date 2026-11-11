import { Rise } from '@/components/motion/Rise'
import { ScrollWordReveal } from '@/components/motion/ScrollWordReveal'
import { GlassCompare } from '@/components/sections/GlassCompare'
import { useLang } from '@/contexts/LangContext'

export function Problem() {
  const { t } = useLang()

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
        <Rise delay={160}>
          <GlassCompare />
        </Rise>
      </div>
    </section>
  )
}
