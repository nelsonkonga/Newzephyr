import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { FunnelStepper } from '@/components/options/FunnelStepper'
import { Button } from '@/components/ui/button'
import { useLang } from '@/contexts/LangContext'
import { PACKAGES, formatPackagePrice } from '@/data/packages'
import { readLeadDraft, storeLead, updateLeadDraft } from '@/lib/lead'

export function OptionsChoice() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draft = readLeadDraft()
  const formule = params.get('formule') || draft?.formule
  const pkg = PACKAGES.find((item) => item.id === formule)
  const [visit, setVisit] = useState(draft?.visit ?? false)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  if (!draft || draft.formule !== formule || !pkg) {
    return <Navigate to={`/options?formule=${formule || 'essentiel'}`} replace />
  }

  const lead = draft
  const selected = pkg
  const name = t(selected.nameKey)
  const price = formatPackagePrice(visit ? selected.visitPrice : selected.price, lang)
  const modeLabel = visit ? t('options.mode.visit') : t('options.mode.supplied')

  async function continueToPay() {
    setStatus('loading')
    updateLeadDraft({ visit, optionsReady: true, paymentAttempted: false })
    const message = lang === 'fr'
      ? `Option choisie : ${name}, ${price}, ${modeLabel}. Email : ${lead.email}. Activité : ${lead.hotel || 'non précisée'}. Téléphone : ${lead.phone || 'non précisé'}.`
      : `Chosen option: ${name}, ${price}, ${modeLabel}. Email: ${lead.email}. Activity: ${lead.hotel || 'not given'}. Phone: ${lead.phone || 'not given'}.`
    await storeLead({
      hotel: lead.hotel,
      email: lead.email,
      phone: lead.phone,
      formule: lead.formule,
      message,
    })
    navigate(`/options/paiement?formule=${lead.formule}`)
  }

  return (
    <main className="pt-24 pb-16 bg-muted/40 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <FunnelStepper current={2} />
        <Link to={`/options?formule=${lead.formule}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('options.step.info')}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">{t('options.choice.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-3">
            {([false, true] as const).map((isVisit) => {
                const active = visit === isVisit
                const amount = formatPackagePrice(isVisit ? selected.visitPrice : selected.price, lang)
                return (
                  <button
                    key={String(isVisit)}
                    type="button"
                    onClick={() => setVisit(isVisit)}
                    className={`w-full text-left rounded-2xl border bg-card p-5 ${active ? 'border-primary shadow-[0_0_0_3px_rgba(59,108,246,0.15)]' : 'border-border'}`}
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block font-semibold">{isVisit ? t('options.mode.visit') : t('options.mode.supplied')}</span>
                        <span className="block text-sm text-muted-foreground mt-1">{isVisit ? t('options.mode.visit.desc') : t('options.mode.supplied.desc')}</span>
                      </span>
                      <span className="font-semibold shrink-0">{amount}</span>
                    </span>
                  </button>
                )
              })}

            {visit && (
              <div className="text-sm text-muted-foreground space-y-1 px-1">
                <p>{t('tarifs.visit.note')}</p>
                <p>{t('tarifs.visit.yaounde')}</p>
                <p>{t('tarifs.visit.outside')}</p>
              </div>
            )}

            <ul className="rounded-2xl border border-border bg-card p-5 space-y-3">
                {selected.featureKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="text-xs text-muted-foreground mb-1">{t('options.summary')}</p>
            <p className="font-semibold mb-1">{name}</p>
            <p className="text-sm text-muted-foreground mb-4">{modeLabel}</p>
            <p className="text-sm text-muted-foreground">{t('options.total')}</p>
            <p className="text-3xl font-semibold tracking-tight mb-5">{price}</p>
            <Button type="button" className="w-full rounded-full h-12" onClick={continueToPay} disabled={status === 'loading'}>
              {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('options.choice.continue')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </aside>
        </div>
      </div>
    </main>
  )
}
