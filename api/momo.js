// Sale prices: 153, 229 and 763 EUR. FCFA = round(eur * 655.957).
const AMOUNTS_XAF = {
  decouverte: { send: 100361, visit: 425900 },
  essentiel: { send: 150214, visit: 977900 },
  complet: { send: 500495, visit: 2617900 },
}

const MOMO_CAP_XAF = 500000
const MOMO_MIN_XAF = 100

function momoParts(total) {
  if (total <= MOMO_CAP_XAF) return [total]
  const parts = []
  let left = total
  while (left > MOMO_CAP_XAF) {
    parts.push(MOMO_CAP_XAF)
    left -= MOMO_CAP_XAF
  }
  if (left < MOMO_MIN_XAF) {
    parts[parts.length - 1] -= MOMO_MIN_XAF - left
    left = MOMO_MIN_XAF
  }
  parts.push(left)
  return parts
}

const FORMULA_LABEL = {
  decouverte: 'Découverte',
  essentiel: 'Essentiel',
  complet: 'Complet',
}

function readBody(body) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'))
    } catch {
      return null
    }
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return body
}

function allowedReturnUrl(value, requestHost) {
  let url
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  if (url.pathname !== '/options/brief') return null
  const host = url.hostname.toLowerCase()
  const current = (requestHost || '').toLowerCase()
  const ownHost = host === 'neloportfolio.vercel.app'
    || host === current
    || (host.endsWith('.vercel.app') && (host.startsWith('neloportfolio.') || host.startsWith('neloportfolio-')))
  if (!ownHost) return null
  return url.toString()
}

function headerHost(req) {
  const headers = req.headers || {}
  const raw = headers['x-forwarded-host'] || headers.host || ''
  return String(raw).split(',')[0].trim().split(':')[0].toLowerCase()
}

function customerName(hotel) {
  const parts = hotel.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return { first_name: parts[0].slice(0, 40), last_name: parts.slice(1).join(' ').slice(0, 40) }
  }
  if (parts.length === 1) return { first_name: parts[0].slice(0, 40), last_name: 'Hotel' }
  return { first_name: 'Client', last_name: 'Hotel' }
}

function prepare(input, requestHost) {
  const formule = input.formule.trim().toLowerCase()
  const method = input.method.trim().toLowerCase()
  const row = AMOUNTS_XAF[formule]
  const label = FORMULA_LABEL[formule]
  const email = input.email.trim()
  const returnUrl = allowedReturnUrl(input.successUrl, requestHost)
    || (requestHost ? allowedReturnUrl(`https://${requestHost}/options/brief?formule=${formule}`, requestHost) : null)
  if (!row || !label) return { reason: 'formule' }
  if (!returnUrl) return { reason: 'url' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return { reason: 'email' }
  if (method !== 'mtn' && method !== 'orange') return { reason: 'method' }
  const digits = input.phone.replace(/\D/g, '')
  const phone = digits.length >= 8 ? input.phone.trim().slice(0, 20) : ''
  const names = customerName(input.hotel)
  const mode = input.visit ? 'venue sur place' : 'contenus envoyés par le client'
  const total = input.visit ? row.visit : row.send
  const parts = momoParts(total)
  const description = parts.length > 1
    ? `Acompte. Nelo. ${label}. ${mode}. Solde à la livraison.`
    : `Nelo. ${label}. ${mode}.`
  return { body: {
    amount: parts[0],
    currency: 'XAF',
    description: description.slice(0, 180),
    return_url: returnUrl,
    customer: {
      email,
      first_name: names.first_name,
      last_name: names.last_name,
      ...(phone ? { phone } : {}),
    },
    metadata: {
      formule,
      visit: input.visit ? 'true' : 'false',
      method,
      hotel: input.hotel.trim().slice(0, 80),
    },
    methods: [method === 'orange' ? 'orange_cm' : 'mtn_cm'],
  } }
}

function checkoutUrl(payload) {
  if (!payload || typeof payload !== 'object') return null
  const data = payload.data && typeof payload.data === 'object' ? payload.data : {}
  const candidates = [data.checkout_url, data.payment_url, data.url, payload.checkout_url, payload.payment_url, payload.url]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    try {
      const url = new URL(candidate)
      if (url.protocol !== 'https:') continue
      return url.toString()
    } catch {
      continue
    }
  }
  return null
}

function cleanEnv(name) {
  let value = process.env[name]?.trim() ?? ''
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim()
  }
  return value
}

function secretKey() {
  let value = cleanEnv('MONEROO_SECRET_KEY')
  if (value.toLowerCase().startsWith('bearer ')) value = value.slice(7).trim()
  return value
}

function fapshiCreds() {
  const apiuser = cleanEnv('FAPSHI_API_USER')
  const apikey = cleanEnv('FAPSHI_API_KEY')
  if (!apiuser || !apikey) return null
  return { apiuser, apikey }
}

function httpsLink(value) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

async function initiateFapshi(creds, body) {
  const externalId = `nelo-${body.metadata.formule}-${body.metadata.method}-${Date.now()}`.slice(0, 100)
  const response = await fetch('https://live.fapshi.com/initiate-pay', {
    method: 'POST',
    headers: {
      apiuser: creds.apiuser,
      apikey: creds.apikey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      amount: body.amount,
      email: body.customer.email,
      redirectUrl: body.return_url,
      externalId,
      message: body.description,
    }),
    signal: AbortSignal.timeout(12000),
  })
  const payload = await response.json().catch(() => null)
  return { status: response.status, url: response.ok ? httpsLink(payload?.link) : null }
}

async function initialize(secret, body) {
  const response = await fetch('https://api.moneroo.io/v1/payments/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  })
  const payload = await response.json().catch(() => null)
  return { status: response.status, url: response.ok ? checkoutUrl(payload) : null }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({})
    return
  }

  const fapshi = fapshiCreds()
  const secret = secretKey()
  if (!fapshi && !secret) {
    res.status(503).json({})
    return
  }

  const raw = readBody(req.body)
  if (!raw || typeof raw !== 'object') {
    res.status(400).json({})
    return
  }

  const prepared = prepare({
    email: typeof raw.email === 'string' ? raw.email : '',
    phone: typeof raw.phone === 'string' ? raw.phone : '',
    hotel: typeof raw.hotel === 'string' ? raw.hotel : '',
    formule: typeof raw.formule === 'string' ? raw.formule : '',
    visit: raw.visit === true,
    method: typeof raw.method === 'string' ? raw.method : '',
    successUrl: typeof raw.successUrl === 'string' ? raw.successUrl : '',
  }, headerHost(req))
  if (!prepared.body) {
    res.status(422).json({ reason: prepared.reason || 'formule' })
    return
  }
  const body = prepared.body

  try {
    if (fapshi) {
      const payment = await initiateFapshi(fapshi, body)
      if (payment.url) {
        res.status(200).json({ url: payment.url })
        return
      }
      res.status(502).json({ upstream: payment.status })
      return
    }
    const first = await initialize(secret, body)
    if (first.url) {
      res.status(200).json({ url: first.url })
      return
    }
    if (first.status === 401 || first.status === 403) {
      res.status(502).json({ upstream: first.status })
      return
    }
    const { methods, metadata, customer, ...rest } = body
    const second = await initialize(secret, {
      ...rest,
      customer: {
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
    })
    if (second.url) {
      res.status(200).json({ url: second.url })
      return
    }
    res.status(502).json({ upstream: second.status || first.status })
  } catch {
    res.status(502).json({})
  }
}
