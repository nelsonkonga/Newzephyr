import { ArrowRight, CalendarClock, PenLine, ShieldCheck } from 'lucide-react'
import { BookCallButton } from '@/components/contact/BookCallButton'
import { HeroArrival } from '@/components/sections/HeroArrival'
import { Emphasis } from '@/components/ui/Emphasis'
import { useLang } from '@/contexts/LangContext'

export function Hero() {
  const { t } = useLang()

  function scrollToPricing() {
    document.querySelector('#tarifs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="overflow-x-hidden pt-[72px] pb-16 sm:pb-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm mb-6 sm:mb-8">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {t('hero.badge')}
            </span>

            <h1 className="text-[2rem] sm:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.08] mb-5 sm:mb-6">
              <Emphasis text={t('hero.title')} />
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-6 sm:mb-8">
              <button
                onClick={scrollToPricing}
                className="inline-flex w-full sm:w-auto items-center justify-center h-14 sm:h-16 rounded-full bg-primary text-primary-foreground pl-6 sm:pl-7 pr-2 text-base sm:text-lg font-semibold shadow-[0_8px_20px_rgba(59,108,246,0.18)] cursor-pointer"
              >
                {t('cta.pricing')}
                <span className="ml-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              <BookCallButton tone="secondary" className="h-14 w-full text-base sm:h-16 sm:w-auto sm:text-lg" />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground" />{t('hero.trust1')}</span>
              <span className="hidden sm:inline h-3 w-px bg-border" />
              <span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-foreground" />{t('hero.trust2')}</span>
              <span className="hidden sm:inline h-3 w-px bg-border" />
              <span className="inline-flex items-center gap-2"><PenLine className="h-4 w-4 text-foreground" />{t('hero.trust3')}</span>
            </div>
          </div>

          <HeroArrival />
        </div>
      </div>
    </section>
  )
}
