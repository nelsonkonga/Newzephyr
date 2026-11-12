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
    const failsafe = window.setTimeout(show, 900)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      show()
      window.clearTimeout(failsafe)
      observer.disconnect()
    }, { threshold: 0.01, rootMargin: '80px 0px' })
    observer.observe(node)
    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [])

  const style = { '--rise-delay': `${delay}ms` } as CSSProperties
  return (
    <div ref={ref} className={`nc-rise ${className}`} data-from={from} style={style}>
      {children}
    </div>
  )
}
