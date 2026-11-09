import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/brand/Logo'
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
  { icon: Linkedin, href: SOCIAL.linkedin, label: 'LinkedIn' },
  { icon: Instagram, href: SOCIAL.instagram, label: 'Instagram' },
  { icon: Facebook, href: SOCIAL.facebook, label: 'Facebook' },
  { icon: Github, href: SOCIAL.github, label: 'GitHub' },
  { icon: Twitter, href: SOCIAL.x, label: 'X' },
]

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3 font-bold text-xl">
              <Logo className="h-9 w-auto text-foreground" />
              Newzephyr
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              <Link to="/" className="font-semibold text-foreground hover:text-primary">
                {t('footer.link')}
              </Link>{' '}
              {t('footer.desc')}
            </p>
            <div className="flex items-center flex-wrap gap-3 mt-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4">Navigation</p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link to={`/${item.href}`} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4">Légal</p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((item) => (
                <li key={item.key}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{t('footer.copyright')}</span>
          <span>Yaoundé, Cameroun</span>
        </div>
      </div>
    </footer>
  )
}
