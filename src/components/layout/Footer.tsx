import { Link } from 'react-router-dom'
import { SocialDock } from '@/components/chrome/SocialDock'
import { FitText } from '@/components/motion/FitText'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'

const NAV_ITEMS = [
  { key: 'nav.offer', href: '#offre' },
  { key: 'nav.examples', href: '#exemples' },
  { key: 'nav.method', href: '#methode' },
  { key: 'nav.pricing', href: '#tarifs' },
  { key: 'nav.faq', href: '#faq' },
]

const LEGAL_LINKS = [
  { key: 'footer.legal', path: '/mentions-legales' },
  { key: 'footer.privacy', path: '/confidentialite' },
  { key: 'footer.cgu', path: '/conditions-generales' },
] as const

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="nd-foot">
      <Rise>
      <SocialDock />
      <div className="nd-foot-links">
        <nav>
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} to={`/${item.href}`}>{t(item.key)}</Link>
          ))}
          {LEGAL_LINKS.map((item) => (
            <Link key={item.key} to={item.path}>{t(item.key)}</Link>
          ))}
        </nav>
        <div className="nd-legal">
          <span>{t('footer.copyright')}</span>
          <span>{t('about.location')}</span>
        </div>
      </div>
      </Rise>
      <Rise delay={140}>
        <FitText text="Newzephyr" className="nd-wordmark" />
      </Rise>
    </footer>
  )
}
