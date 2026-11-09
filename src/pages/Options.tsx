import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Emphasis } from '@/components/ui/Emphasis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'
import { readLeadDraft, saveLeadDraft, storeLead } from '@/lib/lead'

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function Options() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const formule = params.get('formule')
  const pkg = PACKAGES.find((item) => item.id === formule) ?? PACKAGES[1]
  const activeId = pkg.id
  const existing = readLeadDraft()
  const same = existing?.formule === activeId

  const name = t(pkg.nameKey)
  const fromPrice = formatPackagePrice(pkg.price, lang)

  const [hotel, setHotel] = useState(same && existing ? existing.hotel : '')
  const [email, setEmail] = useState(same && existing ? existing.email : '')
  const [phone, setPhone] = useState(same && existing ? existing.phone : '')
  const [emailError, setEmailError] = useState(false)
  const [changing, setChanging] = useState(false)
  const [busy, setBusy] = useState(false)

  const showPhone = validEmail(email)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validEmail(email)) {
      setEmailError(true)
      return
    }
    setBusy(true)
    const draft = {
      formule: activeId,
      hotel: hotel.trim(),
      email: email.trim(),
      phone: phone.trim(),
      visit: false,
      optionsReady: false,
      paymentMethod: 'mtn' as const,
      paymentAttempted: false,
    }
    saveLeadDraft(draft)
    const message = lang === 'fr'
      ? `Informations pour la formule ${name}, à partir de ${fromPrice}. Email : ${draft.email}. Activité : ${draft.hotel || 'non précisée'}. Téléphone : ${draft.phone || 'non précisé'}. L’option n’est pas encore choisie.`
      : `Details for the ${name} package, from ${fromPrice}. Email: ${draft.email}. Activity: ${draft.hotel || 'not given'}. Phone: ${draft.phone || 'not given'}. The option is not chosen yet.`
    await storeLead({ ...draft, message })
    navigate(`/options/choix?formule=${activeId}`)
  }

  return (
    <main className="pt-24 pb-16 bg-muted/40 min-h-screen">
      <div className="max-w-lg mx-auto px-4">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="rounded-2xl bg-primary/10 px-4 py-3 mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('options.package')}</p>
              <p className="text-sm font-semibold">
                {`${name} · ${t('options.from')} ${fromPrice}`}
              </p>
            </div>
            <button type="button" className="text-sm font-semibold text-primary" onClick={() => setChanging((open) => !open)}>
              {t('options.change')}
            </button>
          </div>
          {changing && (
            <div className="mb-6 grid gap-2">
              {PACKAGES.map((item) => (
                <Link
                  key={item.id}
                  to={`/options?formule=${item.id}`}
                  className={`rounded-xl border px-3 py-2 text-sm ${item.id === activeId ? 'border-primary text-primary' : 'border-border'}`}
                  onClick={() => setChanging(false)}
                >
                  {t(item.nameKey)} · {t('options.from')} {formatPackagePrice(item.price, lang)}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-semibold tracking-tight leading-tight mb-3">
            <Emphasis text={t('options.title')} />
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{t('options.lead')}</p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="hotel">
                {t('options.hotel')}
                <span className="text-muted-foreground font-normal"> · {t('options.optional')}</span>
              </Label>
              <Input id="hotel" value={hotel} onChange={(event) => setHotel(event.target.value)} placeholder={t('options.hotel.placeholder')} disabled={busy} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('options.email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setEmailError(false) }}
                placeholder={t('options.email.placeholder')}
                disabled={busy}
              />
              {emailError && <p className="text-xs text-destructive">{t('options.err.email')}</p>}
            </div>
            {showPhone && (
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  {t('options.phone')}
                  <span className="text-muted-foreground font-normal"> · {t('options.phone.hint')}</span>
                </Label>
                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+237 6 00 00 00 00" disabled={busy} />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full rounded-full h-12 mt-6" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('options.see')}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
            {t('options.legal.before')}{' '}
            <Link to="/conditions-generales" className="underline">{t('options.legal.terms')}</Link>
            {' '}{t('options.legal.and')}{' '}
            <Link to="/confidentialite" className="underline">{t('options.legal.privacy')}</Link>
            . {t('options.legal.nospam')}
          </p>
        </form>
      </div>
    </main>
  )
}
