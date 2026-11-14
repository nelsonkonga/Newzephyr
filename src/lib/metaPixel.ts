const PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js'

type Fbq = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  loaded: boolean
  version: string
  push: Fbq
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

export function metaPixelId() {
  const raw = import.meta.env.VITE_META_PIXEL_ID
  if (typeof raw !== 'string') return null
  const id = raw.trim()
  return /^\d{5,20}$/.test(id) ? id : null
}

let started = false

function onCalendly(event: MessageEvent) {
  if (event.origin !== 'https://calendly.com') return
  const data = event.data as { event?: string } | null
  if (data?.event !== 'calendly.event_scheduled') return
  window.fbq?.('track', 'Schedule')
}

export function startMetaPixel() {
  const id = metaPixelId()
  if (!id || started || typeof window === 'undefined') return
  started = true
  const fbq: Fbq = Object.assign(
    (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    },
    { queue: [] as unknown[], loaded: true, version: '2.0', push: undefined as unknown as Fbq },
  )
  fbq.push = fbq
  window.fbq = fbq
  window._fbq = fbq
  const script = document.createElement('script')
  script.async = true
  script.src = PIXEL_SRC
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(script, first)
  window.fbq('init', id)
  window.addEventListener('message', onCalendly)
}

export function trackPageView() {
  if (!metaPixelId()) return
  startMetaPixel()
  window.fbq?.('track', 'PageView')
}
