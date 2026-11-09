import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { WindField } from '@/components/sections/WindField'
import { useLang } from '@/contexts/LangContext'

export function HeroArrival() {
  const { t } = useLang()
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const world = worldRef.current
    if (!stage || !world) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let running = false
    let pointerX = 0
    let pointerY = 0

    const paint = (now: number) => {
      if (!running) return
      const sway = Math.sin(now / 900) * 12
      const nod = Math.cos(now / 1300) * 4
      const yaw = -18 + pointerX * 16 + sway
      const pitch = 10 - pointerY * 8 + nod
      world.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`
      frame = window.requestAnimationFrame(paint)
    }

    const start = () => {
      if (running || reduced.matches) return
      running = true
      frame = window.requestAnimationFrame(paint)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
    }

    const onPointer = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect()
      pointerX = ((event.clientX - box.left) / box.width - 0.5) * 2
      pointerY = ((event.clientY - box.top) / box.height - 0.5) * 2
    }

    const onLeave = () => {
      pointerX = 0
      pointerY = 0
    }

    const intersection = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start()
      else stop()
    })
    intersection.observe(stage)
    const onMotion = () => {
      if (reduced.matches) {
        stop()
        world.style.transform = ''
      } else start()
    }

    stage.addEventListener('pointermove', onPointer)
    stage.addEventListener('pointerleave', onLeave)
    reduced.addEventListener('change', onMotion)

    return () => {
      stop()
      intersection.disconnect()
      stage.removeEventListener('pointermove', onPointer)
      stage.removeEventListener('pointerleave', onLeave)
      reduced.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <div className="relative h-[500px] w-full sm:h-[520px] lg:h-full lg:min-h-[520px]">
      <p className="sr-only">{t('hero.visual.aria')}</p>
      <div ref={stageRef} className="zephyr-stage zephyr-rig absolute inset-0" aria-hidden="true">
        <WindField />
        <svg className="zephyr-wind zephyr-wind-static pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M-4 62 C 18 54, 34 42, 52 48 S 78 40, 106 34" />
          <path d="M-4 74 C 22 80, 40 58, 58 64 S 84 72, 108 56" />
          <path d="M-6 50 C 16 38, 36 46, 54 34 S 80 26, 108 32" />
        </svg>
        <div ref={worldRef} className="zephyr-world">
          <div className="zephyr-sheet" />
          <div className="zephyr-stack">
            <article className="relative rounded-3xl border border-border bg-card shadow-[0_24px_50px_rgba(4,8,21,0.18)]">
              <div className="rounded-t-3xl bg-primary/10 px-4 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{t('hero.visual.site')}</p>
                <p className="mt-1 text-base font-semibold leading-tight">{t('hero.visual.name')}</p>
                <p className="text-sm text-muted-foreground">{t('hero.visual.page')}</p>
              </div>
              <div className="p-4">
                <div className="rounded-2xl bg-muted px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t('hero.visual.request')}</p>
                  <p className="text-sm font-semibold">{t('hero.visual.requestSample')}</p>
                </div>
                <div className="relative mt-3">
                  <div className="zephyr-book flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {t('hero.visual.send')}
                  </div>
                  <div className="zephyr-confirm absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg">
                      <Check className="h-3.5 w-3.5" />
                      {t('hero.visual.received')}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div className="zephyr-slip rounded-2xl border border-border bg-card px-3.5 py-3 shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{t('hero.visual.delay')}</p>
            <p className="mt-1 text-sm font-semibold leading-tight">{t('hero.visual.delayValue')}</p>
            <p className="text-xs text-muted-foreground">{t('hero.visual.from')}</p>
          </div>
          <div className="zephyr-commission rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground line-through">{t('hero.visual.fuzzy')}</div>
          <div className="zephyr-floor" />
        </div>
      </div>
    </div>
  )
}
