import { useEffect, useRef, type ReactNode } from 'react'

export function Parallax({
  dx,
  dy,
  rot = 0,
  delay = 0,
  children,
}: {
  dx: number
  dy: number
  rot?: number
  delay?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let cx = 0
    let cy = 0
    let tx = 0
    let ty = 0
    let raf = 0
    const started = performance.now() + delay
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      tx = nx * dx
      ty = ny * dy
    }
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - started) / 1000))
      const ease = 1 - (1 - t) ** 3
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      const turn = dx === 0 ? 0 : (cx / dx) * rot
      const introY = (1 - ease) * 80
      el.style.opacity = String(ease)
      el.style.transform = `translate3d(${cx}px, ${cy + introY}px, 0) rotate(${turn}deg)`
      if (t >= 1 && !fine) return
      raf = requestAnimationFrame(tick)
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [dx, dy, rot, delay])

  return <div ref={ref} className="nc-arrive">{children}</div>
}
