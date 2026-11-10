import { useEffect, useRef } from 'react'

export function LineField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let running = true
    let width = 0
    let height = 0

    const paint = (now: number) => {
      if (!running) return
      const t = reduce ? 0 : now / 1000
      ctx.clearRect(0, 0, width, height)
      const cx = width * 0.62
      const cy = height * 0.42
      for (let ring = 0; ring < 24; ring++) {
        const rx = 30 + ring * (width * 0.034)
        const ry = rx * 0.48
        const tilt = -0.55
        const blue = ring % 5 === 0
        ctx.beginPath()
        ctx.strokeStyle = blue ? 'rgba(120, 158, 255, 0.45)' : 'rgba(255, 255, 255, 0.16)'
        ctx.lineWidth = blue ? 1.4 : 1
        ctx.ellipse(cx, cy, rx, ry, tilt, 0, Math.PI * 2)
        ctx.stroke()
        const dots = 28 + ring * 8
        for (let i = 0; i < dots; i++) {
          const angle = (i / dots) * Math.PI * 2 + t * (0.12 + ring * 0.004)
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          const x = cx + (cos * rx) * Math.cos(tilt) - (sin * ry) * Math.sin(tilt)
          const y = cy + (cos * rx) * Math.sin(tilt) + (sin * ry) * Math.cos(tilt)
          if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue
          ctx.beginPath()
          ctx.fillStyle = blue ? 'rgba(155, 186, 255, 0.9)' : 'rgba(255, 255, 255, 0.72)'
          ctx.arc(x, y, blue ? 1.8 : 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (!reduce) frame = window.requestAnimationFrame(paint)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce) paint(0)
    }

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !reduce) {
        cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(paint)
      }
    })
    const ro = new ResizeObserver(resize)
    resize()
    observer.observe(canvas)
    ro.observe(canvas)
    if (!reduce) frame = window.requestAnimationFrame(paint)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="nd-field" aria-hidden="true" />
}
