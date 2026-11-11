import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatAmount, packageAmount, type Currency, type PackageDef } from '@/data/packages'

function useSpringNumber(target: number) {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      valueRef.current = target
      setValue(target)
      return
    }
    const from = valueRef.current
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 700)
      const eased = 1 - (1 - t) ** 3
      const next = from + (target - from) * eased
      if (t >= 1) {
        valueRef.current = target
        setValue(target)
        return
      }
      valueRef.current = next
      setValue(Math.round(next))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}

function WireGem({ active, hovered }: { active: boolean; hovered: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef(hovered)
  hoveredRef.current = hovered

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const phi = (1 + Math.sqrt(5)) / 2
    const raw = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ]
    const verts = raw.map(([x, y, z]) => {
      const length = Math.hypot(x, y, z)
      return [x / length, y / length, z / length]
    })
    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10], [1, 5], [1, 9], [1, 8], [1, 7],
      [2, 11], [2, 10], [2, 6], [2, 4], [2, 3], [3, 8], [3, 9], [3, 4], [3, 6],
      [4, 5], [4, 9], [5, 11], [6, 7], [6, 10], [7, 8], [8, 9], [10, 11],
    ]
    let rx = active ? 0.7 : 0.6
    let ry = 0.4
    let frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const draw = () => {
      ctx.clearRect(0, 0, 168, 168)
      ctx.strokeStyle = getComputedStyle(canvas).color
      ctx.fillStyle = ctx.strokeStyle
      ctx.lineWidth = active ? 2.2 : 1.6
      const cX = Math.cos(rx)
      const sX = Math.sin(rx)
      const cY = Math.cos(ry)
      const sY = Math.sin(ry)
      const points = verts.map(([x, y, z]) => {
        const x1 = x * cY + z * sY
        const z1 = -x * sY + z * cY
        const y1 = y * cX - z1 * sX
        const z2 = y * sX + z1 * cX
        return { x: 84 + x1 * 58, y: 84 + y1 * 58, z: z2 }
      })
      ctx.beginPath()
      ctx.ellipse(84, 118, 46, 12, ry * 0.25, 0, Math.PI * 2)
      ctx.globalAlpha = 0.18
      ctx.stroke()
      edges.forEach(([a, b]) => {
        ctx.globalAlpha = Math.max(0.18, ((points[a].z + points[b].z) / 2 + 1.2) / 2.4 * 0.85)
        ctx.beginPath()
        ctx.moveTo(points[a].x, points[a].y)
        ctx.lineTo(points[b].x, points[b].y)
        ctx.stroke()
      })
      points.forEach((point) => {
        ctx.globalAlpha = Math.max(0.35, (point.z + 1.2) / 2.4)
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    draw()
    if (reduced) return
    const loop = () => {
      const speed = hoveredRef.current ? 2.2 : 1
      ry += (active ? 0.012 : 0.008) * speed
      rx += (active ? 0.007 : 0.004) * speed
      draw()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active])

  return <canvas ref={ref} className="nc-plan-gem" width={168} height={168} aria-hidden="true" />
}

function PlanPrice({ amount, currency, lang }: { amount: number; currency: Currency; lang: 'fr' | 'en' }) {
  const shown = useSpringNumber(amount)
  return <p className="nc-plan-price">{formatAmount(shown, currency, lang)}</p>
}

function PlanCard({
  pkg,
  index,
  currency,
  lang,
  name,
  tagline,
  included,
  features,
  cta,
  badge,
}: {
  pkg: PackageDef
  index: number
  currency: Currency
  lang: 'fr' | 'en'
  name: string
  tagline: string
  included: string
  features: string[]
  cta: string
  badge?: string
}) {
  const cardRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)
  const from = index === 0 ? 'left' : index === PACKAGES.length - 1 ? 'right' : 'up'

  const tilt = (event: PointerEvent<HTMLElement>) => {
    const el = cardRef.current
    if (!el || event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = el.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width - 0.5
    const py = (event.clientY - box.top) / box.height - 0.5
    el.style.setProperty('--ry', `${(px * 4.5).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-py * 3.2).toFixed(2)}deg`)
  }
  const reset = () => {
    setHovered(false)
    cardRef.current?.style.setProperty('--rx', '0deg')
    cardRef.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <Rise className="h-full" delay={index * 140} from={from}>
      <article
        ref={cardRef}
        className={`nc-plan ${pkg.popular ? 'is-feat' : ''}`}
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
        onPointerMove={tilt}
        onPointerLeave={reset}
      >
        {badge && <span className="nc-plan-badge">{badge}</span>}
        <div className="nc-plan-top">
          <span className="nc-plan-tag">{pkg.days} {lang === 'fr' ? 'jours' : 'days'}</span>
          <WireGem active={Boolean(pkg.popular)} hovered={hovered} />
        </div>
        <h3>{name}</h3>
        <PlanPrice amount={packageAmount(pkg, currency)} currency={currency} lang={lang} />
        <p className="nc-plan-desc">{tagline}</p>
        <p className="nc-plan-label">{included}</p>
        <ul>
          {features.map((feature) => (
            <li key={feature}><Check aria-hidden="true" /><span>{feature}</span></li>
          ))}
        </ul>
        <Link to={`/options?formule=${pkg.id}`} className="nc-plan-btn">
          <i />
          <span>{cta}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </article>
    </Rise>
  )
}

export function GlassPlans() {
  const { t, lang } = useLang()
  const [currency, setCurrency] = useState<Currency>('eur')

  return (
    <div id="tarifs">
      <div className="nc-fx" role="group" aria-label={lang === 'fr' ? 'Devise' : 'Currency'}>
        {(['eur', 'xaf'] as const).map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={currency === code}
            onClick={() => setCurrency(code)}
          >
            {code === 'eur' ? 'EUR' : 'FCFA'}
          </button>
        ))}
      </div>
      <div className="nc-plans">
        {PACKAGES.map((pkg, index) => (
          <PlanCard
            key={pkg.id}
            pkg={pkg}
            index={index}
            currency={currency}
            lang={lang}
            name={t(pkg.nameKey)}
            tagline={t(pkg.taglineKey)}
            included={t('tarifs.includedTitle')}
            features={pkg.featureKeys.map((key) => t(key))}
            cta={t('tarifs.cta')}
            badge={pkg.popular ? t('tarifs.recommended') : undefined}
          />
        ))}
      </div>
    </div>
  )
}
