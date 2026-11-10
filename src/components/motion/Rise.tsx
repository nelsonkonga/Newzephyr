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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-in')
      return
    }
    let frame = 0
    let observer: IntersectionObserver | null = null
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        observer = new IntersectionObserver(([entry]) => {
          if (!entry?.isIntersecting) return
          node.classList.add('is-in')
          observer?.disconnect()
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
        observer.observe(node)
      })
    })
    return () => {
      cancelAnimationFrame(frame)
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
