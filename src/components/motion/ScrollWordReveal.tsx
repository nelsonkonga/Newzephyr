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
    el.querySelectorAll<HTMLElement>('[data-ch]').forEach((node) => {
      node.hidden = false
    })
    const mark = el.querySelector<HTMLElement>('.nc-caret')
    if (mark) mark.hidden = true
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
