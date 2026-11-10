import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'
import { SOCIAL } from '@/lib/links'

const NAV_ITEMS = [
  { key: 'nav.examples', href: '#exemples' },
  { key: 'nav.method', href: '#methode' },
  { key: 'nav.offer', href: '#offre' },
  { key: 'nav.pricing', href: '#tarifs' },
  { key: 'nav.faq', href: '#faq' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const location = useLocation()
  const home = location.pathname === '/'

  useEffect(() => {
    setMenuOpen(false)
    if (location.pathname === '/' && location.hash) {
      window.setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!home) return
    const onScroll = () => setCompact(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
      <>
        <header className={`nd-top ${!home || compact ? 'is-solid' : ''}`}>
          <div className="nd-top-row">
            <Link to="/" className="nd-brand">
              <Logo className="h-7 w-auto" />
              Newzephyr
            </Link>
            <nav>
              {NAV_ITEMS.map((item) => (
                <Link key={item.key} to={`/${item.href}`}>{t(item.key)}</Link>
              ))}
            </nav>
            <div className="nd-tools">
              <button type="button" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link to="/appel" className="nc-pill" onPointerDown={warmCalendly} onFocus={warmCalendly}>
                <i />
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        </header>
        <button
          type="button"
          className="nd-burger"
          aria-label={t('studio.menu')}
          onClick={() => setMenuOpen(true)}
        >
          <span />
        </button>
        {menuOpen && (
          <div className="nd-menu" role="dialog" aria-label={t('studio.menu')}>
            <button type="button" className="nd-menu-x" aria-label={t('studio.close')} onClick={() => setMenuOpen(false)}>×</button>
            <div className="nd-menu-links">
              {NAV_ITEMS.map((item) => (
                <Link key={item.key} to={`/${item.href}`} onClick={() => setMenuOpen(false)}>{t(item.key)}</Link>
              ))}
              <Link to="/appel" onClick={() => setMenuOpen(false)} onPointerDown={warmCalendly}>{t('nav.cta')}</Link>
            </div>
            <div className="nd-menu-side">
              <p><a href={`mailto:${t('studio.mail')}`}>{t('studio.mail')}</a></p>
              <p><a href={SOCIAL.instagram}>Instagram</a></p>
              <button type="button" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
                {lang === 'fr' ? 'English' : 'Français'}
              </button>
              <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
              </button>
            </div>
          </div>
        )}
      </>
  )
}
