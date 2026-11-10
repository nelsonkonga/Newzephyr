import { useEffect, useMemo, useRef } from 'react'

type Glyph = { ch: string; em: boolean }

function glyphsOf(text: string): Glyph[] {
  const out: Glyph[] = []
  for (const chunk of text.split(/(\{em\}[\s\S]*?\{\/em\})/g)) {
    const marked = chunk.match(/^\{em\}([\s\S]*)\{\/em\}$/)
    const body = marked ? marked[1] : chunk
    for (const ch of body) out.push({ ch, em: Boolean(marked) })
  }
  return out
}

export function ScrollWordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const glyphs = useMemo(() => glyphsOf(text), [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nodes = () => [...el.querySelectorAll<HTMLElement>('[data-ch]')]
    const caret = () => el.querySelector<HTMLElement>('.nc-caret')
    const paint = (count: number) => {
      nodes().forEach((node, index) => {
        node.hidden = index >= count
      })
      const mark = caret()
      if (mark) mark.hidden = count >= glyphs.length
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(glyphs.length)
      return
    }
    let shown = 0
    let raf = 0
    let last = performance.now()
    const target = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh * 0.9 - r.top) / (vh * 0.55)
      return Math.max(0, Math.min(glyphs.length, Math.floor(progress * glyphs.length)))
    }
    const frame = (now: number) => {
      const goal = target()
      const steps = Math.max(1, Math.floor((now - last) / 32))
      last = now
      if (shown < goal) shown = Math.min(goal, shown + steps)
      else if (shown > goal) shown = goal
      paint(shown)
      if (shown !== glyphs.length || goal !== glyphs.length) raf = requestAnimationFrame(frame)
      else raf = 0
    }
    const wake = () => {
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    wake()
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
    }
  }, [glyphs])

  return (
    <h2 ref={ref} className="nc-reveal" aria-label={text.replace(/\{em\}|\{\/em\}/g, '')}>
      {glyphs.map((glyph, index) => (
        <span key={index} data-ch="" hidden className={glyph.em ? 'is-em' : undefined}>
          {glyph.ch}
        </span>
      ))}
      <span className="nc-caret" aria-hidden="true" />
    </h2>
  )
}
