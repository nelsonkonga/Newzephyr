import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type From = 'up' | 'left' | 'right'

export function Rise({
  children,
  className = '',
  delay = 0,
  from = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  from?: From
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const show = () => node.classList.add('is-in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show()
      return
    }
    let frame = 0
    let observer: IntersectionObserver | null = null
    const visibleNow = () => {
      const rect = node.getBoundingClientRect()
      return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    }
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        observer = new IntersectionObserver(([entry]) => {
          if (!entry?.isIntersecting) return
          show()
          observer?.disconnect()
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
        observer.observe(node)
      })
    })
    const failsafe = window.setTimeout(() => {
      if (!node.classList.contains('is-in') && visibleNow()) show()
    }, 1400)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(failsafe)
      observer?.disconnect()
    }
  }, [])

  const style = { '--rise-delay': `${delay}ms` } as CSSProperties
  return (
    <div ref={ref} className={`nc-rise ${className}`} data-from={from} style={style}>
      {children}
    </div>
  )
}
