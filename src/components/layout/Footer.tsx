import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { SocialDock } from '@/components/chrome/SocialDock'
import { useLiquidChrome } from '@/components/chrome/useLiquidChrome'
import { FitText } from '@/components/motion/FitText'
import { useLang } from '@/contexts/LangContext'

const PAGES = [
  { key: 'nav.offer', href: '#offre' },
  { key: 'nav.method', href: '#methode' },
  { key: 'nav.pricing', href: '#tarifs' },
  { key: 'nav.faq', href: '#faq' },
] as const

const LEGAL = [
  { key: 'footer.legal', path: '/mentions-legales' },
  { key: 'footer.privacy', path: '/confidentialite' },
  { key: 'footer.cgu', path: '/conditions-generales' },
] as const

export function Footer() {
  const { t, lang } = useLang()
  const panelRef = useRef<HTMLDivElement>(null)
  useLiquidChrome(panelRef)

  return (
    <footer className="nc-foot">
      <div className="nc-foot-panel" ref={panelRef}>
        <span className="nc-nav-fill" />
        <span className="nc-nav-edge is-blur" />
        <span className="nc-nav-edge" />
        <span className="nc-nav-ridge" />
        <div className="nc-foot-grid">
          <div>
            <Link to="/" className="nc-foot-brand">
              <Logo className="h-7 w-auto" />
              Newzephyr
            </Link>
            <p>{t('about.location')}</p>
          </div>
          <nav>
            <b>{lang === 'fr' ? 'Pages' : 'Pages'}</b>
            {PAGES.map((item) => (
              <Link key={item.key} to={`/${item.href}`}>{t(item.key)}</Link>
            ))}
          </nav>
          <nav>
            <b>{lang === 'fr' ? 'Informations' : 'Information'}</b>
            {LEGAL.map((item) => (
              <Link key={item.key} to={item.path}>{t(item.key)}</Link>
            ))}
          </nav>
          <div>
            <b>Contact</b>
            <a href={`mailto:${t('studio.mail')}`}>{t('studio.mail')}</a>
            <SocialDock className="is-inline" />
          </div>
        </div>
        <p className="nc-foot-copy">{t('footer.copyright')}</p>
      </div>
      <FitText text="Newzephyr" className="nd-wordmark" />
    </footer>
  )
}
