import { useLayoutEffect, useRef, useState } from 'react'

export function FitText({
  text,
  className = '',
  stroke = false,
  color,
}: {
  text: string
  className?: string
  stroke?: boolean
  color?: string
}) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState(64)

  useLayoutEffect(() => {
    const box = boxRef.current
    const measure = measureRef.current
    if (!box || !measure) return
    const fit = () => {
      const w = box.offsetWidth
      const mw = measure.offsetWidth
      if (w > 0 && mw > 0) setSize(Math.max(16, (w / mw) * 100 * 0.995))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    document.fonts?.ready.then(fit)
    const t1 = window.setTimeout(fit, 300)
    return () => {
      ro.disconnect()
      window.clearTimeout(t1)
    }
  }, [text])

  return (
    <span ref={boxRef} className={`nc-fit ${stroke ? 'is-thin' : ''} ${className}`.trim()}>
      <span ref={measureRef} className="nc-fit-measure" aria-hidden="true">{text}</span>
      <span
        className="nc-fit-line"
        style={{
          fontSize: size,
          color: stroke ? 'transparent' : color,
          WebkitTextStroke: stroke ? `${Math.max(1, size * 0.012)}px rgba(237, 235, 230, 0.92)` : undefined,
        }}
      >
        {text}
      </span>
    </span>
  )
}
