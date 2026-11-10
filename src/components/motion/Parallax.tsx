import { useEffect, useRef, type ReactNode } from 'react'

export function Parallax({
  dx,
  dy,
  rot = 0,
  children,
}: {
  dx: number
  dy: number
  rot?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let cx = 0
    let cy = 0
    let tx = 0
    let ty = 0
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      tx = nx * dx
      ty = ny * dy
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      const turn = dx === 0 ? 0 : (cx / dx) * rot
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${turn}deg)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [dx, dy, rot])

  return <div ref={ref}>{children}</div>
}
