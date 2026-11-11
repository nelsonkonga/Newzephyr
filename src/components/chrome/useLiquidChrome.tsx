import { useEffect, type RefObject } from 'react'

export function useLiquidChrome(ref: RefObject<HTMLElement | null>, gradientId?: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const grad = gradientId ? el.querySelector<SVGLinearGradientElement>(`#${gradientId}`) : null
    let t = 1.4
    let last = 0
    let raf = 0
    const paint = () => {
      el.style.setProperty('--orb-phase', `${t * 46 - 85}deg`)
      el.style.setProperty('--orb-counter', `${-t * 31 + 75}deg`)
      el.style.setProperty('--orb-pool-x', `${50 + Math.sin(t * 0.73) * 12}%`)
      el.style.setProperty('--orb-pool-y', `${50 + Math.cos(t * 0.57) * 16.5}%`)
      el.style.setProperty('--orb-light-x', `${50 + Math.cos(t * 0.91) * 48}%`)
      el.style.setProperty('--orb-light-y', `${50 + Math.sin(t * 0.91) * 48}%`)
      ;(['top', 'right', 'bottom', 'left'] as const).forEach((name, index) => {
        el.style.setProperty(
          `--orb-edge-${name}`,
          `${2.6 * (1 + Math.sin(t * 1.13 + (index * Math.PI) / 2) * 0.21)}px`,
        )
      })
      grad?.setAttribute('gradientTransform', `rotate(${45 + Math.sin(t * 0.8) * 15.75} 12 12)`)
    }
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      t += dt * 0.8
      paint()
      raf = requestAnimationFrame(loop)
    }
    paint()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [gradientId])
}

export function ChromeGradient({ id }: { id: string }) {
  const stops = [
    ['0%', '#fff'],
    ['28%', '#64748c'],
    ['43%', '#abcfff'],
    ['54%', '#fff'],
    ['65%', '#fff'],
    ['84%', '#64748c'],
    ['100%', '#fff'],
  ]
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="24" y2="12" gradientTransform="rotate(45 12 12)">
          {stops.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />)}
        </linearGradient>
      </defs>
    </svg>
  )
}
