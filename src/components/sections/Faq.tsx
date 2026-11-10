import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rise } from '@/components/motion/Rise'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'

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
    <section id="faq" className="nc-faq nc-wrap">
      <Rise>
        <p className="nc-kicker">{t('faq.eyebrow')}</p>
        <h2><Emphasis text={t('faq.title')} /></h2>
        <p className="nc-lead" style={{ textAlign: 'left', marginTop: 16 }}>{t('studio.stillLead')}</p>
        <Link to="/appel" className="nc-pill is-solid" style={{ marginTop: 18 }} onPointerDown={warmCalendly}>
          {t('cta.book')}
        </Link>
      </Rise>
      <Rise>
        {ITEMS.map(([question, answer], index) => {
          const shown = open === index
          return (
            <div key={question} className="nc-faq-row">
              <button type="button" aria-expanded={shown} onClick={() => setOpen(shown ? -1 : index)}>
                <span>0{index + 1} — {t(question)}</span>
                <span>{shown ? '–' : '+'}</span>
              </button>
              <p hidden={!shown}>{t(answer)}</p>
            </div>
          )
        })}
      </Rise>
    </section>
  )
}
