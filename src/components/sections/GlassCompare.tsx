import { useEffect, useRef } from 'react'
import { useLang } from '@/contexts/LangContext'
import { useTheme } from '@/contexts/ThemeContext'

const STOPS = [
  ['0%', '#fff'],
  ['28%', '#64748c'],
  ['43%', '#abcfff'],
  ['54%', '#fff'],
  ['65%', '#fff'],
  ['84%', '#64748c'],
  ['100%', '#fff'],
] as const

const SPARKLE = 'M12 1.8C14.2 8.7 15.3 9.8 22.2 12 15.3 14.2 14.2 15.3 12 22.2 9.8 15.3 8.7 14.2 1.8 12 8.7 9.8 9.8 8.7 12 1.8Z'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function Rows({ items, icon, ring }: { items: string[]; icon: string; ring?: boolean }) {
  return (
    <div className="nc-split-col">
      {items.map((text) => (
        <div className="nc-split-row" key={text}>
          <span className={`nc-split-ic${ring ? ' is-ring' : ''}`}>
            <svg viewBox="0 0 24 24"><path d={icon} /></svg>
          </span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  )
}

export function GlassCompare() {
  const { t, lang } = useLang()
  const { theme } = useTheme()
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const beforeRef = useRef<HTMLDivElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)
  const before = [t('compare.b1'), t('compare.b2'), t('compare.b3'), t('compare.b4')]
  const after = [t('compare.a1'), t('compare.a2'), t('compare.a3'), t('compare.a4')]

  useEffect(() => {
    const root = rootRef.current
    const wrap = wrapRef.current
    const card = cardRef.current
    const stage = stageRef.current
    const bw = beforeRef.current
    const dv = divRef.current
    const hd = handleRef.current
    const grad = gradRef.current
    if (!root || !wrap || !card || !stage || !bw || !dv || !hd || !grad) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let split = 50
    let splitTarget = 50
    let drag = false
    let shown = 50
    let time = 1.4
    let last = 0
    let frame = 0
    let idle = 0
    let mode: 'follow' | 'return' = 'follow'
    let returnFrom = 50
    let returnAt = 0
    let lastX = -1
    let lastY = -1

    const startReturn = () => {
      if (mode === 'return') return
      mode = 'return'
      returnFrom = split
      returnAt = performance.now()
    }
    const armIdle = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        if (drag) {
          armIdle()
          return
        }
        startReturn()
      }, 5000)
    }
    const setSplit = (value: number) => {
      mode = 'follow'
      splitTarget = clamp(value, 0, 100)
      armIdle()
    }

    const aim = (event: PointerEvent, force = false) => {
      if (!force && Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY) < 3) return
      lastX = event.clientX
      lastY = event.clientY
      const stageBox = stage.getBoundingClientRect()
      if (event.pointerType === 'mouse' || drag) setSplit(((event.clientX - stageBox.left) / stageBox.width) * 100)
    }

    const leave = () => {
      if (drag) return
      startReturn()
    }
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.button !== 0) return
      drag = true
      stage.setPointerCapture(event.pointerId)
      aim(event, true)
    }
    const end = (event: PointerEvent) => {
      if (!drag) return
      drag = false
      try { stage.releasePointerCapture(event.pointerId) } catch { /* already released */ }
      startReturn()
    }
    const key = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 10 : 2
      if (event.key === 'ArrowLeft') setSplit(splitTarget - step)
      else if (event.key === 'ArrowRight') setSplit(splitTarget + step)
      else if (event.key === 'Home') setSplit(0)
      else if (event.key === 'End') setSplit(100)
      else return
      event.preventDefault()
    }

    const enter = (event: PointerEvent) => aim(event, true)
    const reset = () => setSplit(50)
    wrap.addEventListener('pointermove', aim)
    wrap.addEventListener('pointerenter', enter)
    wrap.addEventListener('pointerleave', leave)
    wrap.addEventListener('dblclick', reset)
    stage.addEventListener('pointerdown', down)
    stage.addEventListener('pointerup', end)
    stage.addEventListener('pointercancel', end)
    dv.addEventListener('keydown', key)

    const paint = () => {
      root.style.setProperty('--orb-phase', `${time * 46 - 85}deg`)
      root.style.setProperty('--orb-counter', `${-time * 31 + 75}deg`)
      root.style.setProperty('--orb-pool-x', `${50 + Math.sin(time * 0.73) * 12}%`)
      root.style.setProperty('--orb-pool-y', `${50 + Math.cos(time * 0.57) * 16.5}%`)
      root.style.setProperty('--orb-light-x', `${50 + Math.cos(time * 0.91) * 48}%`)
      root.style.setProperty('--orb-light-y', `${50 + Math.sin(time * 0.91) * 48}%`)
      ;(['top', 'right', 'bottom', 'left'] as const).forEach((name, index) => {
        root.style.setProperty(
          `--orb-edge-${name}`,
          `${2.5 * (1 + Math.sin(time * 1.13 + (index * Math.PI) / 2) * 0.21)}px`,
        )
      })
      grad.setAttribute('gradientTransform', `rotate(${45 + Math.sin(time * 0.8) * 15.75} 12 12)`)
    }

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      if (!reduced.matches) {
        time += dt * 0.8
        paint()
      }
      if (mode === 'return') {
        const elapsed = clamp((now - returnAt) / 5000, 0, 1)
        const eased = elapsed * elapsed * (3 - 2 * elapsed)
        split = reduced.matches ? 50 : returnFrom + (50 - returnFrom) * eased
      } else {
        split += (splitTarget - split) * (reduced.matches ? 1 : 0.22)
      }
      bw.style.clipPath = `inset(0 ${100 - split}% 0 0)`
      dv.style.left = `${split}%`
      hd.style.left = `${split}%`
      const shownNow = Math.round(split)
      if (shownNow !== shown) {
        shown = shownNow
        dv.setAttribute('aria-valuenow', String(shown))
        dv.setAttribute('aria-valuetext', lang === 'fr' ? `${shown}% révélé` : `${shown}% revealed`)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(idle)
      wrap.removeEventListener('pointermove', aim)
      wrap.removeEventListener('pointerenter', enter)
      wrap.removeEventListener('pointerleave', leave)
      wrap.removeEventListener('dblclick', reset)
      stage.removeEventListener('pointerdown', down)
      stage.removeEventListener('pointerup', end)
      stage.removeEventListener('pointercancel', end)
      dv.removeEventListener('keydown', key)
    }
  }, [lang])

  return (
    <div ref={rootRef} className="nc-split" data-theme={theme}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient ref={gradRef} id="nc-chrome-compare" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="24" y2="12">
            {STOPS.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />)}
          </linearGradient>
        </defs>
      </svg>
      <div ref={wrapRef} className="nc-split-wrap" role="group" aria-label={`${t('compare.before')} / ${t('compare.after')}`}>
        <div ref={cardRef} className="nc-split-card">
          <div className="nc-split-glass" />
          <div className="nc-split-edge is-blur" />
          <div className="nc-split-edge" />
          <div className="nc-split-ridge" />
          <div ref={stageRef} className="nc-split-stage">
            <div className="nc-split-panel is-new">
              <Rows items={after} icon="M5 12.5l4.5 4.5L19 7.5" ring />
            </div>
            <div ref={beforeRef} className="nc-split-before" aria-hidden="true">
              <div className="nc-split-panel is-old">
                <Rows items={before} icon="M6 6l12 12M18 6L6 18" />
              </div>
            </div>
            <div className="nc-split-vig" />
            <div className="nc-split-glare" />
            <div className="nc-split-lbl" style={{ left: 14 }}>{t('compare.before')}</div>
            <div className="nc-split-lbl is-after" style={{ right: 14 }}>
              <svg viewBox="0 0 24 24"><path d={SPARKLE} /></svg>
              {t('compare.after')}
            </div>
            <div
              ref={divRef}
              className="nc-split-div"
              role="slider"
              tabIndex={0}
              aria-label={lang === 'fr' ? 'Ajuster la comparaison' : 'Adjust the comparison'}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              aria-orientation="horizontal"
            />
            <div ref={handleRef} className="nc-split-handle is-ring" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M9 7L4 12L9 17M15 7L20 12L15 17" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
