import { useEffect, type RefObject } from 'react'

export function useLiquidChrome(ref: RefObject<HTMLElement | null>, gradientId?: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--orb-phase', '-40deg')
    el.style.setProperty('--orb-counter', '40deg')
    if (!gradientId) return
    el.querySelector(`#${gradientId}`)?.setAttribute('gradientTransform', 'rotate(45 12 12)')
  }, [ref, gradientId])
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
