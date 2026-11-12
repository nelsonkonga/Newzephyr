import { Count, useInView } from '@/components/home/chrome'
import { useLang } from '@/contexts/LangContext'

const BENEFITS = [
  ['offer.b1.title', 'offer.b1.desc'],
  ['offer.b2.title', 'offer.b2.desc'],
  ['offer.b3.title', 'offer.b3.desc'],
  ['offer.b4.title', 'offer.b4.desc'],
] as const

export function Offer() {
  const { t } = useLang()
  const [ref, seen] = useInView<HTMLElement>()

  return (
    <section className="nd-facts" ref={ref} aria-labelledby="facts-title">
      <article className="nd-fact">
        <h3 id="facts-title">{t(BENEFITS[0][0])}</h3>
        <p>{t(BENEFITS[0][1])}</p>
      </article>
      <article className="nd-fact is-ink">
        <strong><Count to={153} on={seen} /> €</strong>
        <p>{t('hero.visual.from')}</p>
      </article>
      <article className="nd-fact is-blue">
        <strong><Count to={2} on={seen} /></strong>
        <p>{t('tarifs.revisions')}</p>
      </article>
      <article className="nd-fact">
        <h3>{t(BENEFITS[1][0])}</h3>
        <p>{t(BENEFITS[1][1])}</p>
      </article>
      <article className="nd-fact">
        <strong><Count to={21} on={seen} /></strong>
        <p>{t('tarifs.delay').replace('{n}', '21')}</p>
      </article>
      <article className="nd-fact">
        <h3>{t(BENEFITS[3][0])}</h3>
        <p>{t(BENEFITS[3][1])}</p>
      </article>
    </section>
  )
}
