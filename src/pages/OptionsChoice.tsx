import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { FunnelStepper } from '@/components/options/FunnelStepper'
import { Button } from '@/components/ui/button'
import { useLang } from '@/contexts/LangContext'
import { SaleSummary } from '@/components/pricing/FormerPrice'
import { PACKAGES, salePhrase } from '@/data/packages'
import { readLeadDraft, storeLead, updateLeadDraft } from '@/lib/lead'

export function OptionsChoice() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draft = readLeadDraft()
  const formule = params.get('formule') || draft?.formule
  const pkg = PACKAGES.find((item) => item.id === formule)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  if (!draft || draft.formule !== formule || !pkg) {
    return <Navigate to={`/options?formule=${formule || 'essentiel'}`} replace />
  }

  const lead = draft
  const selected = pkg
  const name = t(selected.nameKey)
  const price = salePhrase(selected, lang)
  const modeLabel = t('options.mode.supplied')

  async function continueToPay() {
    setStatus('loading')
    updateLeadDraft({ visit: false, optionsReady: true, paymentAttempted: false })
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
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <FunnelStepper current={2} />
        <Link to={`/options?formule=${lead.formule}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('options.step.info')}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">{t('options.choice.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-3">
            <div className="w-full text-left rounded-2xl border border-primary bg-card p-5 shadow-[0_0_0_3px_rgba(59,108,246,0.15)]">
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block font-semibold">{t('options.mode.supplied')}</span>
                  <span className="block text-sm text-muted-foreground mt-1">{t('options.mode.supplied.desc')}</span>
                </span>
                <span className="shrink-0 text-right"><SaleSummary pkg={selected} lang={lang} /></span>
              </span>
            </div>

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
            <div className="mb-5"><SaleSummary pkg={selected} lang={lang} /></div>
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
