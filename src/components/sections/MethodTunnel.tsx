import { Timeline, type TimelineEntry } from '@/components/ui/timeline'
import { useLang } from '@/contexts/LangContext'

const STEPS = [
  { n: '01', title: 'method.s1.title', desc: 'method.s1.desc', image: '/studio/step-call.jpg' },
  { n: '02', title: 'method.s2.title', desc: 'method.s2.desc', image: '/studio/step-deposit.jpg' },
  { n: '03', title: 'method.s3.title', desc: 'method.s3.desc', image: '/studio/step-delivery.jpg' },
  { n: '04', title: 'method.s4.title', desc: 'method.s4.desc', image: '/studio/step-live.jpg' },
] as const

export function MethodTunnel() {
  const { t } = useLang()
  const data: TimelineEntry[] = STEPS.map((step) => ({
    title: step.n,
    content: (
      <div className="nc-tl-copy">
        <h4>{t(step.title)}</h4>
        <p>{t(step.desc)}</p>
        <img src={step.image} alt="" />
      </div>
    ),
  }))

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  )
}
