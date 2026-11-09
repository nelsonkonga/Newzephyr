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
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl"><Emphasis text={t('method.title')} /></h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t('method.subtitle')}</p>
        <div className="zephyr-method-track mt-10 mb-12" aria-hidden="true">
          <span ref={fillRef} className="zephyr-method-fill" />
        </div>
        <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([number, title, desc]) => (
            <li key={number}>
              <p className="text-5xl font-semibold tracking-tight text-primary">{number}</p>
              <h3 className="mt-4 text-xl font-semibold">{t(title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
