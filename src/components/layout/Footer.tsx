import { Link } from 'react-router-dom'
import { FitText } from '@/components/motion/FitText'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'
import { SOCIAL } from '@/lib/links'

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
]

const SOCIAL_LINKS = [
  { href: SOCIAL.linkedin, label: 'LinkedIn' },
  { href: SOCIAL.instagram, label: 'Instagram' },
  { href: SOCIAL.facebook, label: 'Facebook' },
  { href: SOCIAL.github, label: 'GitHub' },
  { href: SOCIAL.x, label: 'X' },
]

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="nd-foot">
      <Rise>
      <div className="nd-foot-links">
        <nav>
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} to={`/${item.href}`}>{t(item.key)}</Link>
          ))}
          {LEGAL_LINKS.map((item) => (
            <Link key={item.key} to={item.path}>{t(item.key)}</Link>
          ))}
          {SOCIAL_LINKS.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
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
