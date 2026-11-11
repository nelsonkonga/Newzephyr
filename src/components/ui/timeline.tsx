import { useEffect, useRef, useState, type ReactNode } from 'react'

export type TimelineEntry = {
  title: string
  content: ReactNode
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const list = listRef.current
    const container = containerRef.current
    if (!list || !container) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const measure = () => setHeight(list.getBoundingClientRect().height)
    const onScroll = () => {
      if (reduced) {
        setProgress(1)
        return
      }
      const rect = container.getBoundingClientRect()
      const start = window.innerHeight * 0.15
      const end = window.innerHeight * 0.55
      const total = Math.max(rect.height - (end - start), 1)
      setProgress(Math.min(1, Math.max(0, (start - rect.top) / total)))
    }
    const onResize = () => {
      measure()
      onScroll()
    }
    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [data])

  return (
    <div ref={containerRef} className="nc-tl">
      <div ref={listRef} className="nc-tl-list">
        {data.map((item) => (
          <div className="nc-tl-row" key={item.title}>
            <div className="nc-tl-side">
              <span className="nc-tl-dot" />
              <h3>{item.title}</h3>
            </div>
            <div className="nc-tl-body">
              <h3 className="nc-tl-title-sm">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div className="nc-tl-track" style={{ height: height ? `${height}px` : undefined }}>
          <i style={{ height: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </div>
  )
}
