import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }

type Lane = {
  points: Point[]
  variable: '--primary' | '--gold'
  alpha: number
  color: string
}

type Particle = {
  lane: number
  t: number
  speed: number
  radius: number
  alpha: number
}

const LANES: Array<Pick<Lane, 'points' | 'variable' | 'alpha'>> = [
  { points: curve([-4, 62], [18, 54], [34, 42], [52, 48], [78, 40], [106, 34]), variable: '--primary', alpha: 0.9 },
  { points: curve([-4, 74], [22, 80], [40, 58], [58, 64], [84, 72], [108, 56]), variable: '--gold', alpha: 0.72 },
  { points: curve([-6, 50], [16, 38], [36, 46], [54, 34], [80, 26], [108, 32]), variable: '--primary', alpha: 0.4 },
]

function curve(start: number[], c1: number[], c2: number[], end: number[], nextC: number[], nextEnd: number[]): Point[] {
  const reflected: number[] = [2 * end[0] - c2[0], 2 * end[1] - c2[1]]
  return [
    ...sample(start, c1, c2, end, 28),
    ...sample(end, reflected, nextC, nextEnd, 28).slice(1),
  ]
}

function sample(p0: number[], p1: number[], p2: number[], p3: number[], steps: number): Point[] {
  const points: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    points.push({
      x: u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      y: u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    })
  }
  return points
}

function pointAt(points: Point[], t: number): Point {
  const span = points.length - 1
  const wrapped = ((t % 1) + 1) % 1
  const pos = wrapped * span
  const index = Math.floor(pos)
  const local = pos - index
  const a = points[index]
  const b = points[Math.min(index + 1, span)]
  return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local }
}

function resolveColor(variable: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${variable})`
  probe.hidden = true
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

export function WindField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) {
      canvas.dataset.failed = 'true'
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lanes: Lane[] = LANES.map((lane) => ({ ...lane, color: resolveColor(lane.variable) }))
    const particles: Particle[] = []
    for (let lane = 0; lane < lanes.length; lane++) {
      for (let i = 0; i < 36; i++) {
        particles.push({
          lane,
          t: i / 36 + Math.random() * 0.008,
          speed: 0.00008 + Math.random() * 0.00006,
          radius: 1.2 + Math.random() * 1.6,
          alpha: 0.4 + Math.random() * 0.6,
        })
      }
    }

    let width = 0
    let height = 0
    let running = false
    let frame = 0
    let last = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = (now: number) => {
      if (!running) return
      const dt = Math.min(32, last ? now - last : 16)
      last = now
      context.clearRect(0, 0, width, height)
      for (const particle of particles) {
        particle.t += particle.speed * dt
        if (particle.t > 1) particle.t -= 1
        const lane = lanes[particle.lane]
        const head = pointAt(lane.points, particle.t)
        const tail = pointAt(lane.points, particle.t - 0.04)
        context.strokeStyle = lane.color
        context.globalAlpha = particle.alpha * lane.alpha
        context.lineWidth = particle.radius
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo((tail.x / 100) * width, (tail.y / 100) * height)
        context.lineTo((head.x / 100) * width, (head.y / 100) * height)
        context.stroke()
      }
      context.globalAlpha = 1
      frame = window.requestAnimationFrame(paint)
    }

    const start = () => {
      if (running || reduced.matches || document.hidden) return
      running = true
      last = 0
      frame = window.requestAnimationFrame(paint)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
    }

    const refreshColors = () => {
      for (const lane of lanes) lane.color = resolveColor(lane.variable)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const onMotion = () => {
      if (reduced.matches) stop()
      else start()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersection = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start()
      else stop()
    })
    intersection.observe(canvas)
    const theme = new MutationObserver(refreshColors)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', onMotion)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      theme.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', onMotion)
    }
  }, [])

  return <canvas ref={canvasRef} className="zephyr-wind-field pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
}
