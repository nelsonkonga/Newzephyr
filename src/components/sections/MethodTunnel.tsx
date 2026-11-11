import { useLang } from '@/contexts/LangContext'

const STEPS = [
  { n: '01', title: 'method.s1.title', desc: 'method.s1.desc' },
  { n: '02', title: 'method.s2.title', desc: 'method.s2.desc' },
  { n: '03', title: 'method.s3.title', desc: 'method.s3.desc' },
  { n: '04', title: 'method.s4.title', desc: 'method.s4.desc' },
] as const

export function MethodTunnel() {
  const { t } = useLang()

  return (
    <ol className="nc-timeline">
      {STEPS.map((step) => (
        <li key={step.n}>
          <span>{step.n}</span>
          <div>
            <h3>{t(step.title)}</h3>
            <p>{t(step.desc)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
