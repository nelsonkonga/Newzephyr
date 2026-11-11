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

function Plus() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1v12M1 7h12" />
    </svg>
  )
}

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="nc-faq">
      <div className="nc-faq-page">
        <Rise>
          <header className="nc-faq-head">
            <p className="nc-kicker">{t('faq.eyebrow')}</p>
            <h2><Emphasis text={t('faq.title')} /></h2>
            <p>{t('studio.stillLead')}</p>
            <Link to="/appel" className="nc-pill is-solid" onPointerDown={warmCalendly}>
              {t('cta.book')}
            </Link>
          </header>
        </Rise>
        <div>
          {ITEMS.map(([question, answer], index) => {
            const shown = open === index
            const right = index % 2 === 1
            return (
              <Rise key={question} delay={index * 60}>
                <article className={`nc-faq-item${right ? ' is-right' : ''}${shown ? ' is-open' : ''}`}>
                  <div className="nc-faq-col">
                    <button
                      type="button"
                      className="nc-faq-slab"
                      aria-expanded={shown}
                      onClick={() => setOpen(shown ? -1 : index)}
                    >
                      <span className="nc-faq-q">
                        <span>{t(question)}</span>
                        <i className="nc-faq-ico"><Plus /></i>
                      </span>
                    </button>
                    <i className="nc-faq-tail" />
                  </div>
                  <div className="nc-faq-ans">
                    <div>
                      <div className="nc-faq-ans-pad">
                        <div className="nc-faq-slab">
                          <p>{t(answer)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Rise>
            )
          })}
        </div>
      </div>
    </section>
  )
}
