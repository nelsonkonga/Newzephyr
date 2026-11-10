import { Eyebrow } from '@/components/home/chrome'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const STEPS = [
  ['01', 'method.s1.title', 'method.s1.desc', ''],
  ['02', 'method.s2.title', 'method.s2.desc', ''],
  ['03', 'method.s3.title', 'method.s3.desc', 'is-blue'],
  ['04', 'method.s4.title', 'method.s4.desc', ''],
] as const

export function Methodology() {
  const { t } = useLang()

  return (
    <section id="methode" className="nd-steps">
      <div className="nd-steps-intro">
        <Eyebrow>{t('method.eyebrow')}</Eyebrow>
        <h2><Emphasis text={t('method.title')} /></h2>
        <p>{t('method.subtitle')}</p>
      </div>
      {STEPS.map(([n, title, desc, tone]) => (
        <article key={n} className={`nd-step ${tone}`}>
          <header>
            <span>{n}</span>
            <span>{t('method.eyebrow')}</span>
          </header>
          <h3>{t(title)}</h3>
          <p>{t(desc)}</p>
        </article>
      ))}
    </section>
  )
}
