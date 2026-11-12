export type PackageId = 'decouverte' | 'essentiel' | 'complet'

export type Currency = 'eur' | 'xaf'

export const EUR_TO_FCFA = 655.957

export interface PackageDef {
  id: PackageId
  price: string
  priceEur: number
  wasPrice: string
  wasPriceEur: number
  visitPrice: string
  days: number
  popular?: boolean
  nameKey: string
  taglineKey: string
  popularBadgeKey?: string
  includedHeaderKey?: string
  featureKeys: string[]
}

export const PACKAGES: PackageDef[] = [
  {
    id: 'decouverte',
    price: '153 €',
    priceEur: 153,
    wasPrice: '449 €',
    wasPriceEur: 449,
    visitPrice: '649 €',
    days: 7,
    nameKey: 'tarifs.pkg.decouverte.name',
    taglineKey: 'tarifs.pkg.decouverte.tagline',
    featureKeys: [
      'tarifs.pkg.decouverte.f1',
      'tarifs.pkg.decouverte.f2',
      'tarifs.pkg.decouverte.f3',
      'tarifs.pkg.decouverte.f4',
    ],
  },
  {
    id: 'essentiel',
    price: '229 €',
    priceEur: 229,
    wasPrice: '990 €',
    wasPriceEur: 990,
    visitPrice: '1 490 €',
    days: 21,
    popular: true,
    nameKey: 'tarifs.pkg.essentiel.name',
    taglineKey: 'tarifs.pkg.essentiel.tagline',
    includedHeaderKey: 'tarifs.pkg.essentiel.includedHeader',
    featureKeys: [
      'tarifs.pkg.essentiel.f1',
      'tarifs.pkg.essentiel.f2',
      'tarifs.pkg.essentiel.f3',
    ],
  },
  {
    id: 'complet',
    price: '763 €',
    priceEur: 763,
    wasPrice: '2 990 €',
    wasPriceEur: 2990,
    visitPrice: '3 990 €',
    days: 30,
    nameKey: 'tarifs.pkg.complet.name',
    taglineKey: 'tarifs.pkg.complet.tagline',
    includedHeaderKey: 'tarifs.pkg.complet.includedHeader',
    featureKeys: [
      'tarifs.pkg.complet.f1',
      'tarifs.pkg.complet.f2',
    ],
  },
]

export function packageAmount(pkg: PackageDef, currency: Currency) {
  return currency === 'eur' ? pkg.priceEur : Math.round(pkg.priceEur * EUR_TO_FCFA)
}

export function packageWasAmount(pkg: PackageDef, currency: Currency) {
  return currency === 'eur' ? pkg.wasPriceEur : Math.round(pkg.wasPriceEur * EUR_TO_FCFA)
}

export function reductionPercent(pkg: PackageDef) {
  return Math.round((1 - pkg.priceEur / pkg.wasPriceEur) * 100)
}

export function salePhrase(pkg: PackageDef, lang: 'fr' | 'en') {
  const now = formatPackagePrice(pkg.price, lang)
  const was = formatPackagePrice(pkg.wasPrice, lang)
  const off = reductionPercent(pkg)
  const xaf = formatAmount(packageAmount(pkg, 'xaf'), 'xaf', lang)
  const wasXaf = formatAmount(packageWasAmount(pkg, 'xaf'), 'xaf', lang)
  if (lang === 'fr') return `${now} au lieu de ${was} (−${off} %), soit ${xaf} au lieu de ${wasXaf}`
  return `${now} instead of ${was} (−${off}%), that is ${xaf} instead of ${wasXaf}`
}

export function formatAmount(value: number, currency: Currency, lang: 'fr' | 'en') {
  const grouped = value.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')
  if (currency === 'eur') return lang === 'fr' ? `${grouped} €` : `€${grouped}`
  return `${grouped} FCFA`
}

export function formatPackagePrice(price: string, lang: 'fr' | 'en') {
  if (lang === 'fr') return price
  const digits = price.replace(' €', '').replace(/\s/g, '')
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `€${grouped}`
}

export function packageWhatsappMessage(lang: 'fr' | 'en', name: string, price: string, visit: boolean) {
  if (lang === 'fr') {
    const mode = visit
      ? 'avec venue sur place pour les photos et les textes'
      : 'avec textes et photos envoyés par l’activité'
    return `Bonjour Newzephyr, je souhaite réserver un appel de 20 minutes au sujet de la formule ${name} (${price}, ${mode}) pour mon activité.`
  }
  const mode = visit
    ? 'with an on-site visit for the photos and the texts'
    : 'with texts and photos sent by the business'
  return `Hello Newzephyr, I would like to book a 20-minute call about the ${name} package (${price}, ${mode}) for my business.`
}
