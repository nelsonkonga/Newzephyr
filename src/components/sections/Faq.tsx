import { useState } from 'react'
import { Eyebrow, PlusLink } from '@/components/home/chrome'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

const ITEMS = [
  ['faq.q1', 'faq.a1'],
  ['faq.q2', 'faq.a2'],
  ['faq.q3', 'faq.a3'],
  ['faq.q4', 'faq.a4'],
  ['faq.q6', 'faq.a6'],
  ['faq.q7', 'faq.a7'],
] as const

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="nd-faq">
      <div className="nd-faq-side">
        <Eyebrow>{t('faq.eyebrow')}</Eyebrow>
        <h2><Emphasis text={t('faq.title')} /></h2>
        <p className="nd-index" style={{ marginTop: 28 }}>{t('studio.still')}</p>
        <p>{t('studio.stillLead')}</p>
        <PlusLink to="/appel">{t('cta.book')}</PlusLink>
      </div>
      <div>
        {ITEMS.map(([question, answer], index) => {
          const shown = open === index
          return (
            <div key={question} className="nd-faq-row">
              <button
                type="button"
                aria-expanded={shown}
                onClick={() => setOpen(shown ? -1 : index)}
              >
                <span>0{index + 1}</span>
                {t(question)}
                <span>{shown ? '–' : '+'}</span>
              </button>
              <p hidden={!shown}>{t(answer)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
