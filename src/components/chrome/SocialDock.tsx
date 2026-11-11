import { useEffect, useRef } from 'react'
import { Dribbble, Facebook, Instagram } from 'lucide-react'
import { ChromeGradient, useLiquidChrome } from '@/components/chrome/useLiquidChrome'
import { useLang } from '@/contexts/LangContext'
import { SOCIAL } from '@/lib/links'

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M10.2 17.2c.4-1.6 1-3.4 1.8-4.6.8-.8 2-.9 2.8-.4 1.1.7 1.5 2.2.6 3.4-.7.9-1.9 1.1-2.6.6" />
      <path d="M11.2 11.2c.2-2 1.6-3.4 3.2-3.2" />
    </svg>
  )
}

const ITEMS = [
  { title: 'Instagram', href: SOCIAL.instagram, icon: Instagram },
  { title: 'Facebook', href: SOCIAL.facebook, icon: Facebook },
  { title: 'Dribbble', href: '', icon: Dribbble },
  { title: 'Pinterest', href: '', icon: PinterestIcon },
] as const

export function SocialDock() {
  const { t } = useLang()
  const outerRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])
  const mouse = useRef(Number.POSITIVE_INFINITY)
  useLiquidChrome(outerRef, 'nc-chrome-dock')

  useEffect(() => {
    const sizes = ITEMS.map(() => 42)
    let raf = 0
    const tick = () => {
      ITEMS.forEach((_, index) => {
        const node = nodes.current[index]
        if (!node) return
        const box = node.getBoundingClientRect()
        const dist = Number.isFinite(mouse.current) ? mouse.current - box.x - box.width / 2 : 400
        const reach = Math.min(1, Math.abs(dist) / 150)
        const target = 42 + (68 - 42) * (1 - reach)
        sizes[index] += (target - sizes[index]) * 0.22
        node.style.width = `${sizes[index]}px`
        node.style.height = `${sizes[index]}px`
      })
      raf = requestAnimationFrame(tick)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={outerRef}
      className="nc-dock"
      onMouseMove={(event) => { mouse.current = event.pageX }}
      onMouseLeave={() => { mouse.current = Number.POSITIVE_INFINITY }}
    >
      <ChromeGradient id="nc-chrome-dock" />
      <span className="nc-dock-glass" />
      <span className="nc-dock-edge is-blur" />
      <span className="nc-dock-edge" />
      <span className="nc-dock-ridge" />
      <div className="nc-dock-bar">
        {ITEMS.map((item, index) => {
          const Icon = item.icon
          const soon = !item.href
          const label = soon ? `${item.title}, ${t('studio.soon')}` : item.title
          const body = (
            <>
              <span className="nc-dock-tip">{soon ? t('studio.soon') : item.title}</span>
              <span className="nc-dock-ico">
                <span className="nc-dock-face is-a"><Icon /></span>
                <span className="nc-dock-face is-b"><Icon /></span>
                <span className="nc-dock-ring" />
              </span>
            </>
          )
          if (soon) {
            return (
              <button
                key={item.title}
                type="button"
                ref={(node) => { nodes.current[index] = node }}
                className="nc-dock-hit"
                aria-label={label}
                aria-disabled="true"
              >
                {body}
              </button>
            )
          }
          return (
            <a
              key={item.title}
              ref={(node) => { nodes.current[index] = node }}
              className="nc-dock-hit"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              {body}
            </a>
          )
        })}
      </div>
    </div>
  )
}
