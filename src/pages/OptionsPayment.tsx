import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { FunnelStepper } from '@/components/options/FunnelStepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/contexts/LangContext'
import { formatMomoAmount, momoAmountXaf, momoParts } from '@/data/momoAmounts'
import { PACKAGES, formatPackagePrice } from '@/data/packages'
import { momoNumber, openCheckout, personalMomoMethods } from '@/lib/checkout'
import { readLeadDraft, updateLeadDraft, type PaymentMethod } from '@/lib/lead'

export function OptionsPayment() {
  const { t, lang } = useLang()
  const [params] = useSearchParams()
  const draft = readLeadDraft()
  const formule = params.get('formule') || draft?.formule
  const pkg = PACKAGES.find((item) => item.id === formule)
  const personalMethods = personalMomoMethods()
  const methods: PaymentMethod[] = personalMethods.length > 0 ? personalMethods : ['mtn', 'orange']
  const [method, setMethod] = useState<PaymentMethod>(
    methods.includes(draft?.paymentMethod ?? 'mtn') ? (draft?.paymentMethod ?? 'mtn') : methods[0],
  )
  const [reference, setReference] = useState(draft?.paymentReference ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'manual' | 'unavailable' | 'formule' | 'url' | 'email' | 'method'>('idle')

  if (!draft || draft.formule !== formule || !pkg) {
    return <Navigate to={`/options?formule=${formule || 'essentiel'}`} replace />
  }
  if (!draft.optionsReady) {
    return <Navigate to={`/options/choix?formule=${draft.formule}`} replace />
  }

  const lead = draft
  const name = t(pkg.nameKey)
  const modeLabel = lead.visit ? t('options.mode.visit') : t('options.mode.supplied')
  const euro = formatPackagePrice(lead.visit ? pkg.visitPrice : pkg.price, lang)
  const xaf = momoAmountXaf(lead.formule, lead.visit)
  const parts = xaf == null ? [] : momoParts(xaf)
  const due = parts[0] ?? null
  const total = xaf == null ? euro : formatMomoAmount(xaf, lang)
  const dueLabel = due == null ? total : formatMomoAmount(due, lang)
  const balance = parts.slice(1)
  const number = momoNumber(method)
  const motif = lead.hotel || lead.email

  function choose(next: PaymentMethod) {
    setMethod(next)
    setStatus('idle')
    updateLeadDraft({ paymentMethod: next })
  }

  async function pay() {
    updateLeadDraft({ paymentMethod: method, paymentAttempted: true, paymentReference: reference.trim() })
    setStatus('loading')
    const result = await openCheckout({
      email: lead.email,
      phone: lead.phone,
      hotel: lead.hotel,
      formule: lead.formule,
      visit: lead.visit,
      method,
      amountLabel: dueLabel,
      successUrl: `${window.location.origin}/options/brief?formule=${lead.formule}`,
      cancelUrl: window.location.href,
    })
    if (result === 'manual') setStatus('manual')
    else if (result !== 'redirect') setStatus(result)
  }

  function goToBrief() {
    updateLeadDraft({ paymentMethod: method, paymentAttempted: true, paymentReference: reference.trim() })
  }

  return (
    <main className="pt-24 pb-16 bg-muted/40 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <FunnelStepper current={3} />
        <Link to={`/options/choix?formule=${lead.formule}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('options.step.options')}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">{t('options.pay.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <section className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t('options.pay.method')}</p>
            <div className="space-y-3" role="radiogroup" aria-label={t('options.pay.method')}>
              {([
                ['mtn', t('options.pay.mtn'), t('options.pay.mtn.hint')],
                ['orange', t('options.pay.orange'), t('options.pay.orange.hint')],
              ] as const).filter(([value]) => methods.includes(value)).map(([value, label, hint]) => {
                const active = method === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => choose(value)}
                    className={`w-full text-left rounded-2xl border bg-card p-5 ${active ? 'border-primary shadow-[0_0_0_3px_rgba(59,108,246,0.15)]' : 'border-border'}`}
                  >
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{hint}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-5">{t('options.pay.secure')}</p>
          </section>

          <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="text-xs text-muted-foreground mb-1">{t('options.summary')}</p>
            <p className="font-semibold mb-1">{name}</p>
            <p className="text-sm text-muted-foreground mb-4">{modeLabel}</p>
            {balance.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">{t('options.total')}</p>
                <p className="text-2xl font-semibold tracking-tight">{total}</p>
                {xaf != null && <p className="text-sm text-muted-foreground mt-1 mb-4">{euro}</p>}
              </>
            )}
            <p className="text-sm text-muted-foreground">{t('options.pay.due')}</p>
            <p className="text-3xl font-semibold tracking-tight">{dueLabel}</p>
            {xaf != null && balance.length === 0 && <p className="text-sm text-muted-foreground mt-1">{euro}</p>}
            {balance.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{t('options.pay.cap')}</p>
                <p className="text-sm font-medium mt-3">{t('options.pay.balance')}</p>
                <ul className="mt-1 space-y-1">
                  {balanceGroups(balance).map((group) => (
                    <li key={`${group.amount}-${group.count}`} className="text-sm">
                      {group.count > 1 ? `${group.count} × ${formatMomoAmount(group.amount, lang)}` : formatMomoAmount(group.amount, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button type="button" className="w-full rounded-full h-auto min-h-12 whitespace-normal text-center leading-tight mt-5" onClick={pay} disabled={status === 'loading'}>
              {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'loading' ? t('options.pay.redirecting') : `${balance.length > 0 ? t('options.pay.deposit') : t('options.pay.continue')} · ${dueLabel}`}
              {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
            </Button>
            {status === 'manual' && number && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">{t('options.pay.send').replace('{amount}', dueLabel).replace('{number}', number)}</p>
                <p className="text-sm text-muted-foreground">{t('options.pay.motif')} : {motif}</p>
                <p className="text-sm text-muted-foreground">{t('options.pay.seen')}</p>
                <div className="space-y-1.5">
                  <Label htmlFor="payment-reference">
                    {t('options.pay.reference')}
                    <span className="text-muted-foreground font-normal"> · {t('options.optional')}</span>
                  </Label>
                  <Input
                    id="payment-reference"
                    value={reference}
                    onChange={(event) => {
                      setReference(event.target.value)
                      updateLeadDraft({ paymentReference: event.target.value.trim() })
                    }}
                  />
                </div>
                <Button variant="outline" className="w-full h-12 rounded-[10px] border-primary text-primary hover:bg-primary/5 hover:text-primary" asChild>
                  <Link to={`/options/brief?formule=${lead.formule}`} onClick={goToBrief}>
                    {t('options.pay.brief')}
                  </Link>
                </Button>
              </div>
            )}
            {(status === 'unavailable' || status === 'formule' || status === 'url' || status === 'email' || status === 'method') && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-destructive">
                  {status === 'unavailable' ? t('options.pay.error') : t(`options.pay.reason.${status}`)}{' '}
                  <strong className="font-semibold">{t('options.pay.uncharged')}</strong>
                </p>
                <Button variant="outline" className="w-full h-12 rounded-[10px] border-primary text-primary hover:bg-primary/5 hover:text-primary" asChild>
                  <Link to={`/options/brief?formule=${lead.formule}`} onClick={goToBrief}>
                    {t('options.pay.brief')}
                  </Link>
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

function balanceGroups(parts: number[]) {
  const groups: { amount: number, count: number }[] = []
  for (const amount of parts) {
    const last = groups[groups.length - 1]
    if (last && last.amount === amount) last.count += 1
    else groups.push({ amount, count: 1 })
  }
  return groups
}
