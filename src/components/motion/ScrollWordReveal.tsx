import { useEffect, useMemo, useRef } from 'react'

type Token = { word: string; em: boolean }

const DIM = [52, 51, 47]
const LIGHT = [237, 235, 230]
const ACCENT = [107, 147, 248]

function tokenize(text: string): Token[] {
  const out: Token[] = []
  for (const chunk of text.split(/(\{em\}[\s\S]*?\{\/em\})/g)) {
    const marked = chunk.match(/^\{em\}([\s\S]*)\{\/em\}$/)
    const body = marked ? marked[1] : chunk
    for (const word of body.match(/\S+/g) ?? []) out.push({ word, em: Boolean(marked) })
  }
  return out
}

function mix(from: number[], to: number[], t: number) {
  const c = from.map((v, i) => Math.round(v + (to[i] - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export function ScrollWordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const spans = useRef<(HTMLSpanElement | null)[]>([])
  const words = useMemo(() => tokenize(text), [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const paint = (progress: number) => {
      const n = Math.max(1, words.length)
      words.forEach((word, i) => {
        const node = spans.current[i]
        if (!node) return
        const from = i / n
        const to = (i + 1) / n
        const local = Math.min(1, Math.max(0, (progress - from) / (to - from)))
        node.style.color = mix(DIM, word.em ? ACCENT : LIGHT, local)
      })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1)
      return
    }
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh * 0.85 - r.top) / (vh * 0.4 + r.height)
      paint(Math.min(1, Math.max(0, progress)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [words])

  return (
    <h2 ref={ref} className="nc-reveal">
      {words.map((word, i) => {
        const punctuation = /^[.,;:!?…]/.test(word.word)
        return (
          <span key={`${word.word}-${i}`} ref={(node) => { spans.current[i] = node }} style={{ color: 'rgb(52, 51, 47)' }}>
            {i > 0 && !punctuation ? ' ' : ''}{word.word}
          </span>
        )
      })}
    </h2>
  )
}
