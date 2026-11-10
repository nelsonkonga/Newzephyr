import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const location = useLocation()
  const home = location.pathname === '/'

  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
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

  if (home) {
    return (
      <>
        <header className={`nd-top ${compact ? 'is-away' : ''}`}>
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
            </div>
          </div>
        </header>
        <button
          type="button"
          className={`nd-burger ${compact ? 'is-on' : ''}`}
          aria-label={t('studio.menu')}
          onClick={() => setMenuOpen(true)}
        >
          <span />
        </button>
        {compact && !menuOpen && (
          <Link to="/#tarifs" className="nd-dock">{t('studio.dock')}</Link>
        )}
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-[72px] gap-4">
          <Link to="/" className="zephyr-mark flex items-center gap-2 font-semibold text-[17px] tracking-tight shrink-0">
            <Logo className="h-7 w-auto text-foreground" />
            <span className="whitespace-nowrap">Newzephyr</span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={`/${item.href}`}
                className="px-3 py-2 text-[16px] font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center justify-end gap-1">
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="text-sm font-semibold px-2 py-1 cursor-pointer"
              aria-label={lang === 'fr' ? 'English' : 'Français'}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
              className="p-2 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/#tarifs"
              className="ml-2 inline-flex items-center gap-2 appearance-none rounded-full bg-secondary px-4 py-2 text-[16px] font-medium"
            >
              {t('nav.pricing')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button className="lg:hidden justify-self-end p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={`/${item.href}`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2.5 text-base font-semibold"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3 pt-3">
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="text-xs font-semibold border border-border rounded-full px-2 py-1 cursor-pointer"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 cursor-pointer" aria-label="Thème">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <div className="pt-2 px-3 flex flex-col gap-2">
              <Link
                to="/#tarifs"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-secondary py-3 text-center font-semibold"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                to="/appel"
                onClick={() => setMobileOpen(false)}
                onPointerDown={warmCalendly}
                className="rounded-full bg-primary text-primary-foreground py-3 text-center font-semibold"
              >
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
