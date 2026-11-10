import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { warmCalendly } from '@/lib/calendly'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="nd-eye">
      <i /><i /><i />
      <span>{children}</span>
    </p>
  )
}

export function PlusLink({
  to,
  children,
  tone = 'dark',
  onClick,
}: {
  to: string
  children: ReactNode
  tone?: 'dark' | 'light' | 'blue'
  onClick?: () => void
}) {
  const call = to === '/appel'
  return (
    <Link
      to={to}
      className={`nd-plus is-${tone}`}
      onClick={onClick}
      onPointerDown={call ? warmCalendly : undefined}
      onFocus={call ? warmCalendly : undefined}
    >
      <span>{children}</span>
      <b>+</b>
    </Link>
  )
}

export function Marquee({ items, tone = 'light' }: { items: string[]; tone?: 'light' | 'dark' }) {
  const line = [...items, ...items]
  return (
    <div className={`nd-marquee is-${tone}`} aria-hidden="true">
      <div className="nd-marquee-track">
        {line.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setOn(true)
    }, { threshold: 0.18 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, on] as const
}

export function Count({ to, on }: { to: number; on: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 850)
      setValue(Math.round(to * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [on, to])

  return <>{value}</>
}
