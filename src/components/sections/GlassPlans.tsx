import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'

function WireGem({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

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
    let rx = 0.6
    let ry = 0.4
    let frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const draw = () => {
      ctx.clearRect(0, 0, 168, 168)
      ctx.strokeStyle = getComputedStyle(canvas).color
      ctx.fillStyle = ctx.strokeStyle
      ctx.lineWidth = 2
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
    const loop = () => {
      ry += active ? 0.02 : 0.008
      rx += active ? 0.012 : 0.005
      draw()
      frame = requestAnimationFrame(loop)
    }
    draw()
    if (!reduced) frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active])

  return <canvas ref={ref} className="nc-plan-gem" width={168} height={168} aria-hidden="true" />
}

export function GlassPlans() {
  const { t, lang } = useLang()

  return (
    <div className="nc-plans" id="tarifs">
      {PACKAGES.map((pkg, index) => {
        const price = formatPackagePrice(pkg.price, lang)
        const from = index === 0 ? 'left' : index === PACKAGES.length - 1 ? 'right' : 'up'
        return (
          <Rise key={pkg.id} className="h-full" delay={index * 140} from={from}>
            <article
              className={`nc-plan ${pkg.popular ? 'is-feat' : ''}`}
              onPointerMove={(event) => {
                if (event.pointerType === 'touch') return
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
                const rect = event.currentTarget.getBoundingClientRect()
                const px = (event.clientX - rect.left) / rect.width - 0.5
                const py = (event.clientY - rect.top) / rect.height - 0.5
                event.currentTarget.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`)
                event.currentTarget.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`)
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty('--rx', '0deg')
                event.currentTarget.style.setProperty('--ry', '0deg')
              }}
            >
              {pkg.popular && <span className="nc-plan-badge">{t('tarifs.recommended')}</span>}
              <div className="nc-plan-top">
                <span className="nc-plan-tag">{pkg.days} {lang === 'fr' ? 'jours' : 'days'}</span>
                <WireGem active={Boolean(pkg.popular)} />
              </div>
              <h3>{t(pkg.nameKey)}</h3>
              <p className="nc-plan-price">{price}</p>
              <p className="nc-plan-desc">{t(pkg.taglineKey)}</p>
              <p className="nc-plan-label">{t('tarifs.includedTitle')}</p>
              <ul>
                {pkg.featureKeys.map((key) => (
                  <li key={key}><Check aria-hidden="true" /><span>{t(key)}</span></li>
                ))}
              </ul>
              <Link to={`/options?formule=${pkg.id}`} className="nc-plan-btn">
                <i />
                <span>{t('tarifs.cta')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </Rise>
        )
      })}
    </div>
  )
}
