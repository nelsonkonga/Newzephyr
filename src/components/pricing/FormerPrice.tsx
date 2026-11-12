import { formatAmount, formatPackagePrice, packageAmount, packageWasAmount, reductionPercent, type Currency, type PackageDef } from '@/data/packages'

export function FormerPrice({
  pkg,
  currency,
  lang,
}: {
  pkg: PackageDef
  currency: Currency
  lang: 'fr' | 'en'
}) {
  const was = formatAmount(packageWasAmount(pkg, currency), currency, lang)
  const off = reductionPercent(pkg)
  const label = lang === 'fr'
    ? `Ancien prix ${was}, réduction de ${off} pour cent`
    : `Previous price ${was}, ${off} percent off`

  return (
    <p className="nc-plan-was" aria-label={label}>
      <s aria-hidden="true">{was}</s>
      <span className="nc-plan-off" aria-hidden="true">−{off} %</span>
    </p>
  )
}

export function SaleSummary({ pkg, lang }: { pkg: PackageDef; lang: 'fr' | 'en' }) {
  const off = reductionPercent(pkg)
  const euro = formatPackagePrice(pkg.price, lang)
  const wasEuro = formatPackagePrice(pkg.wasPrice, lang)
  const xaf = formatAmount(packageAmount(pkg, 'xaf'), 'xaf', lang)
  const wasXaf = formatAmount(packageWasAmount(pkg, 'xaf'), 'xaf', lang)
  const label = lang === 'fr'
    ? `${euro} au lieu de ${wasEuro}, réduction de ${off} pour cent, ${xaf} au lieu de ${wasXaf}`
    : `${euro} instead of ${wasEuro}, ${off} percent off, ${xaf} instead of ${wasXaf}`

  return (
    <span className="block" aria-label={label}>
      <span className="flex flex-wrap items-center gap-2" aria-hidden="true">
        <s className="text-muted-foreground">{wasEuro}</s>
        <span className="rounded-full bg-[#c4a15a] px-2 py-0.5 text-[11px] font-bold leading-none text-[#1c1406]">−{off} %</span>
      </span>
      <s className="block text-muted-foreground" aria-hidden="true">{wasXaf}</s>
      <span className="mt-1 block font-semibold" aria-hidden="true">{euro}</span>
      <span className="block text-sm text-muted-foreground" aria-hidden="true">{xaf}</span>
    </span>
  )
}
