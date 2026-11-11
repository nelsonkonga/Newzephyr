import { useEffect, useRef } from 'react'
import { useLang } from '@/contexts/LangContext'
import { useTheme } from '@/contexts/ThemeContext'

const STEPS = [
  { n: '01', title: 'method.s1.title', desc: 'method.s1.desc', at: 0.16 },
  { n: '02', title: 'method.s2.title', desc: 'method.s2.desc', at: 0.4 },
  { n: '03', title: 'method.s3.title', desc: 'method.s3.desc', at: 0.64 },
  { n: '04', title: 'method.s4.title', desc: 'method.s4.desc', at: 0.88 },
] as const

function Art({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 400 300" aria-hidden="true">
        <circle cx="290" cy="120" r="46" />
        <circle cx="290" cy="120" r="80" opacity="0.6" />
        <circle cx="290" cy="120" r="116" opacity="0.3" />
        <rect x="48" y="70" width="140" height="64" rx="20" />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 400 300" aria-hidden="true">
        <circle cx="280" cy="120" r="64" />
        <text x="280" y="138" textAnchor="middle">€</text>
        <ellipse cx="280" cy="210" rx="64" ry="14" />
      </svg>
    )
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 400 300" aria-hidden="true">
        <polygon points="290,40 360,80 360,170 290,210 220,170 220,80" />
        <path d="M50 90h120M50 120h90M50 150h110" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true">
      <circle cx="290" cy="130" r="78" />
      <ellipse cx="290" cy="130" rx="30" ry="78" />
      <path d="M108 190l16 16 28-32" />
    </svg>
  )
}

export function MethodTunnel() {
  const { t } = useLang()
  const { theme } = useTheme()
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const dotsRef = useRef<Array<HTMLElement | null>>([])
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const canvas = canvasRef.current
    if (!track || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let drift = 0

    const paint = (progress: number) => {
      const dark = document.documentElement.classList.contains('dark')
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio)
        canvas.height = Math.floor(height * ratio)
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, width, height)
      const cx = width * 0.5
      const cy = height * 0.5
      ctx.strokeStyle = dark ? 'rgba(107,147,248,0.55)' : 'rgba(59,108,246,0.45)'
      ctx.lineWidth = 1.25
      for (let i = 0; i < 16; i += 1) {
        const z = ((i / 16) + progress * 0.85 + drift) % 1
        const scale = 0.08 + z * z * 1.35
        ctx.globalAlpha = 0.15 + z * 0.75
        ctx.beginPath()
        ctx.ellipse(cx, cy, width * 0.22 * scale, height * 0.22 * scale, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.strokeStyle = dark ? 'rgba(237,235,230,0.28)' : 'rgba(22,23,28,0.2)'
      for (let i = 0; i < 12; i += 1) {
        const angle = (i / 12) * Math.PI * 2 + progress * 0.4
        ctx.globalAlpha = 0.35
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * width, cy + Math.sin(angle) * height)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      let nearest = 0
      STEPS.forEach((step, index) => {
        if (Math.abs(progress - step.at) < Math.abs(progress - STEPS[nearest].at)) nearest = index
      })
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        const on = index === nearest
        card.style.opacity = on ? '1' : '0'
        card.style.zIndex = on ? '3' : '1'
        card.style.transform = 'translate3d(-50%, -50%, 0)'
      })
      dotsRef.current.forEach((dot, index) => dot?.classList.toggle('is-on', progress >= STEPS[index].at - 0.08))
      railRef.current?.style.setProperty('--p', progress.toFixed(3))
    }

    const loop = () => {
      const rect = track.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0
      if (!reduced) drift = (drift + 0.0015) % 1
      paint(reduced ? 1 : progress)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [theme, t])

  return (
    <div className="nc-tunnel" ref={trackRef}>
      <div className="nc-tunnel-stage">
        <canvas ref={canvasRef} className="nc-tunnel-gl" />
        <div className="nc-tunnel-vignette" />
        <div className="nc-tunnel-rail" ref={railRef} aria-hidden="true">
          <i />
          {STEPS.map((step, index) => (
            <span key={step.n} ref={(node) => { dotsRef.current[index] = node }}>
              <em>{step.n}</em>
            </span>
          ))}
        </div>
        {STEPS.map((step, index) => (
          <article key={step.n} className="nc-tunnel-card" ref={(node) => { cardsRef.current[index] = node }}>
            <div className="nc-tunnel-art"><Art index={index} /></div>
            <b>{step.n}</b>
            <h3>{t(step.title)}</h3>
            <p>{t(step.desc)}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
