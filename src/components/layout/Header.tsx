import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { ChromeGradient, useLiquidChrome } from '@/components/chrome/useLiquidChrome'
import { useTheme } from '@/contexts/ThemeContext'
import { useLang } from '@/contexts/LangContext'
import { warmCalendly } from '@/lib/calendly'

const NAV_ITEMS = [
  { key: 'nav.examples', href: '#exemples' },
  { key: 'nav.method', href: '#methode' },
  { key: 'nav.offer', href: '#offre' },
  { key: 'nav.pricing', href: '#tarifs' },
  { key: 'nav.faq', href: '#faq' },
] as const

export function Header() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const hlRef = useRef<HTMLSpanElement>(null)
  const location = useLocation()
  const home = location.pathname === '/'
  const solid = !home || compact || menuOpen
  useLiquidChrome(rootRef, 'nc-chrome-nav')

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
    const onScroll = () => setCompact(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const showHighlight = (event: MouseEvent<HTMLAnchorElement>) => {
    const mark = hlRef.current
    const link = event.currentTarget
    if (!mark) return
    mark.style.width = `${link.offsetWidth}px`
    mark.style.transform = `translateX(${link.offsetLeft}px)`
    mark.style.opacity = '1'
  }

  return (
    <header ref={rootRef} className={`nc-nav ${solid ? 'is-solid' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <ChromeGradient id="nc-chrome-nav" />
      <div className="nc-nav-pill">
        <span className="nc-nav-fill" />
        <span className="nc-nav-edge is-blur" />
        <span className="nc-nav-edge" />
        <span className="nc-nav-ridge" />
        <div className="nc-nav-in">
          <Link to="/" className="nd-brand" onClick={() => setMenuOpen(false)}>
            <Logo className="h-7 w-auto" />
            Newzephyr
          </Link>
          <nav className="nc-nav-links" onMouseLeave={() => { if (hlRef.current) hlRef.current.style.opacity = '0' }}>
            <span ref={hlRef} className="nc-nav-hl" />
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} to={`/${item.href}`} onMouseEnter={showHighlight}>{t(item.key)}</Link>
            ))}
          </nav>
          <div className="nc-nav-acts">
            <button type="button" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/appel" className="nc-pill is-solid" onPointerDown={warmCalendly} onFocus={warmCalendly}>
              {t('nav.cta')}
            </Link>
          </div>
          <button
            type="button"
            className="nc-nav-tog"
            aria-label={t('studio.menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
        <div className="nc-nav-menu">
          <span className="nc-nav-fill" />
          <span className="nc-nav-edge" />
          <span className="nc-nav-ridge" />
          <div className="nc-nav-list">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} to={`/${item.href}`} onClick={() => setMenuOpen(false)}>{t(item.key)}</Link>
            ))}
            <button type="button" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
              {lang === 'fr' ? 'English' : 'Français'}
            </button>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
            </button>
            <Link to="/appel" className="nc-pill is-solid" onClick={() => setMenuOpen(false)} onPointerDown={warmCalendly}>
              {t('nav.cta')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
