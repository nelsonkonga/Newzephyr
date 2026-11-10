import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '@/contexts/LangContext'
import { calendlyEmbedUrl } from '@/lib/calendly'

const FRAME_CLASS = 'h-[760px] w-full border-0 bg-card'

export function BookCall() {
  const { t } = useLang()
  const slot = useRef<HTMLDivElement>(null)
  const hostname = typeof window === 'undefined' ? 'www.newzephyr.co' : window.location.hostname
  const url = calendlyEmbedUrl(hostname)
  const [reuseEarly] = useState(
    () => typeof document !== 'undefined' && document.getElementById('calendly-early') instanceof HTMLIFrameElement,
  )

  useLayoutEffect(() => {
    const frame = document.getElementById('calendly-early')
    const parent = slot.current
    if (!(frame instanceof HTMLIFrameElement) || !parent) return
    frame.id = ''
    frame.style.cssText = ''
    frame.className = FRAME_CLASS
    frame.title = t('call.title')
    if (frame.parentElement !== parent) parent.replaceChildren(frame)
  }, [t])

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-4">{t('call.title')}</h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl">{t('call.lead')}</p>
        {url ? (
          <div ref={slot} className="h-[760px] w-full">
            {reuseEarly ? null : (
              <iframe title={t('call.title')} src={url} className={FRAME_CLASS} loading="eager" />
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('call.missing')}</p>
        )}
        <p className="mt-8">
          <Link to="/#tarifs" className="text-sm font-semibold text-primary">
            {t('cta.pricing')}
          </Link>
        </p>
      </div>
    </main>
  )
}
