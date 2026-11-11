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
    <section id="faq" className="nc-ask nc-wrap">
      <div className="nc-ask-grid">
        <Rise>
          <p className="nc-kicker">{t('faq.eyebrow')}</p>
          <h2><Emphasis text={t('faq.title')} /></h2>
          <p className="nc-lead" style={{ textAlign: 'left', marginTop: 16 }}>{t('studio.stillLead')}</p>
          <Link to="/appel" className="nc-pill is-solid" style={{ marginTop: 18 }} onPointerDown={warmCalendly}>
            {t('cta.book')}
          </Link>
        </Rise>
        <div className="nc-ask-list">
          {ITEMS.map(([question, answer], index) => {
            const shown = open === index
            return (
              <Rise key={question} delay={index * 70}>
                <article className={`nc-ask-card ${shown ? 'is-open' : ''}`}>
                  <button type="button" aria-expanded={shown} onClick={() => setOpen(shown ? -1 : index)}>
                    <b>0{index + 1}</b>
                    <span>{t(question)}</span>
                    <i>{shown ? '–' : '+'}</i>
                  </button>
                  <p hidden={!shown}>{t(answer)}</p>
                </article>
              </Rise>
            )
          })}
        </div>
      </div>
    </section>
  )
}
