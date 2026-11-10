import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '@/contexts/LangContext'

const EASE = 'cubic-bezier(.77,0,.175,1)'

export function CustomCursor() {
  const { t } = useLang()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const labels = useRef({ view: t('studio.view'), explore: t('studio.explore') })
  labels.current = { view: t('studio.view'), explore: t('studio.explore') }

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('nc-has-cursor')
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0
    let last = performance.now()
    let mode = ''
    let visible = false

    const setMode = (next: string) => {
      if (next === mode) return
      mode = next
      const big = next === 'view' || next === 'explore'
      const size = big ? 108 : next === 'link' ? 64 : 36
      ring.style.width = `${size}px`
      ring.style.height = `${size}px`
      ring.style.background = big ? '#6b93f8' : 'transparent'
      ring.style.borderColor = big || next === 'link' ? '#6b93f8' : 'rgba(237, 235, 230, 0.55)'
      label.textContent = next === 'view' ? labels.current.view : next === 'explore' ? labels.current.explore : ''
      dot.style.opacity = big ? '0' : '1'
    }
    const show = (v: boolean) => {
      if (v === visible) return
      visible = v
      dot.style.opacity = v && mode !== 'view' && mode !== 'explore' ? '1' : '0'
      ring.style.opacity = v ? '1' : '0'
    }
    const zoneOf = (el: Element | null) => {
      const zone = el?.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (zone === 'view' || zone === 'explore') return zone
      if (el?.closest('a, button, [role="button"], input, textarea, select, label')) return 'link'
      return ''
    }
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        ringPos.x = pos.x
        ringPos.y = pos.y
      }
      show(true)
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
    }
    const onOver = (e: PointerEvent) => setMode(zoneOf(e.target as Element))
    const onLeave = () => show(false)
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = 1 - Math.pow(1 - 0.18, dt * 60)
      ringPos.x += (pos.x - ringPos.x) * k
      ringPos.y += (pos.y - ringPos.y) * k
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('nc-has-cursor')
    }
  }, [])

  return createPortal(
    <div aria-hidden="true">
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 2147483000,
          width: 36,
          height: 36,
          boxSizing: 'border-box',
          border: '1px solid rgba(237, 235, 230, 0.55)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
          transition: `width .45s ${EASE}, height .45s ${EASE}, background-color .3s, border-color .3s, opacity .3s`,
        }}
      >
        <span
          ref={labelRef}
          style={{
            color: '#070910',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 12,
            letterSpacing: '0.08em',
            lineHeight: 1,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 2147483000,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#6b93f8',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity .25s',
        }}
      />
    </div>,
    document.body,
  )
}
