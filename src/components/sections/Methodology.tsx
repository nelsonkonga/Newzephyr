import { useEffect, useRef } from 'react'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const STEPS = [
  ['01', 'method.s1.title', 'method.s1.desc'],
  ['02', 'method.s2.title', 'method.s2.desc'],
  ['03', 'method.s3.title', 'method.s3.desc'],
  ['04', 'method.s4.title', 'method.s4.desc'],
] as const

export function Methodology() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const fill = fillRef.current
    if (!section || !fill) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let listening = false

    const paint = () => {
      const rect = section.getBoundingClientRect()
      const view = window.innerHeight
      const start = view * 0.85
      const end = view * 0.25 - rect.height
      const span = start - end
      const next = span === 0 ? 0 : Math.min(1, Math.max(0, (start - rect.top) / span))
      fill.style.transform = `scaleX(${next})`
    }

    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(paint)
    }

    const listen = () => {
      if (listening || reduced.matches) return
      listening = true
      paint()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    }

    const silence = () => {
      listening = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.cancelAnimationFrame(frame)
    }

    const applyMotion = () => {
      if (reduced.matches) {
        silence()
        fill.style.transform = 'scaleX(1)'
        return
      }
      const rect = section.getBoundingClientRect()
      if (rect.bottom > 0 && rect.top < window.innerHeight) listen()
      else silence()
    }

    const intersection = new IntersectionObserver(([entry]) => {
      if (reduced.matches) return
      if (entry?.isIntersecting) listen()
      else silence()
    })
    intersection.observe(section)
    applyMotion()
    reduced.addEventListener('change', applyMotion)

    return () => {
      silence()
      intersection.disconnect()
      reduced.removeEventListener('change', applyMotion)
    }
  }, [])

  return (
    <section id="methode" ref={sectionRef} className="py-20 sm:py-28">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center mb-4"><Emphasis text={t('method.title')} /></h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{t('method.subtitle')}</p>
        <div className="zephyr-method-track mx-auto mb-14" aria-hidden="true">
          <span ref={fillRef} className="zephyr-method-fill" />
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map(([number, title, desc]) => (
            <li key={number} className="rounded-3xl border border-border bg-card p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-medium text-primary mb-4">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {number}
              </p>
              <h3 className="text-2xl font-semibold mb-3">{t(title)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
