import { Eyebrow, Marquee } from '@/components/home/chrome'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function BeforeAfter() {
  const { t } = useLang()
  const before = ['compare.b1', 'compare.b2', 'compare.b3', 'compare.b4'] as const
  const after = ['compare.a1', 'compare.a2', 'compare.a3', 'compare.a4'] as const

  return (
    <section className="nd-dark" aria-labelledby="compare-title">
      <Marquee
        tone="light"
        items={[t('compare.before'), t('compare.after'), '3 000 €', '153 €', t('compare.b2'), t('compare.a2')]}
      />
      <div className="nd-dark-inner">
        <div>
          <Eyebrow>{t('compare.eyebrow')}</Eyebrow>
          <h2 id="compare-title"><Emphasis text={t('compare.title')} /></h2>
        </div>
        <div className="nd-compare">
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
