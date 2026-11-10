import { useEffect, useRef, type ReactNode } from 'react'

export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let scale = 1
    let targetScale = 1
    let raf = 0
    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      scale += (targetScale - scale) * 0.2
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      raf = requestAnimationFrame(tick)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2 - x
      const cy = r.top + r.height / 2 - y
      tx = (e.clientX - cx) * 0.35
      ty = (e.clientY - cy) * 0.35
    }
    const enter = () => {
      targetScale = 1.04
      el.classList.add('is-hot')
    }
    const leave = () => {
      tx = 0
      ty = 0
      targetScale = 1
      el.classList.remove('is-hot')
    }
    const down = () => { targetScale = 0.97 }
    const up = () => { targetScale = 1.04 }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointerup', up)
    }
  }, [])

  return <div ref={ref} className="nc-magnetic">{children}</div>
}
