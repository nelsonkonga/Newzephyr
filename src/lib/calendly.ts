const CALENDLY_HOSTS = ['calendly.com']

function allowedCalendlyUrl(raw: string) {
  try {
    const url = new URL(raw.trim())
    const host = url.hostname.toLowerCase()
    const allowed = CALENDLY_HOSTS.some((name) => host === name || host.endsWith(`.${name}`))
    if (url.protocol !== 'https:' || !allowed) return null
    return url
  } catch {
    return null
  }
}

export function calendlyUrl() {
  const raw = import.meta.env.VITE_CALENDLY_URL
  if (typeof raw !== 'string' || !raw.trim()) return null
  return allowedCalendlyUrl(raw)?.toString() ?? null
}

export function calendlyEmbedUrl(hostname: string) {
  const raw = calendlyUrl()
  if (!raw) return null
  const url = new URL(raw)
  url.searchParams.set('embed_domain', hostname)
  url.searchParams.set('embed_type', 'Inline')
  url.searchParams.set('hide_gdpr_banner', '1')
  url.searchParams.set('hide_event_type_details', '1')
  url.searchParams.set('primary_color', '3b6cf6')
  return url.toString()
}

let warmed = false

export function warmCalendly() {
  if (warmed || typeof document === 'undefined') return
  const url = calendlyEmbedUrl(window.location.hostname)
  if (!url) return
  warmed = true
  const connect = document.createElement('link')
  connect.rel = 'preconnect'
  connect.href = 'https://calendly.com'
  document.head.appendChild(connect)
  const prefetch = document.createElement('link')
  prefetch.rel = 'prefetch'
  prefetch.as = 'document'
  prefetch.href = url
  document.head.appendChild(prefetch)
}
