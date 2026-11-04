import { useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { FunnelStepper } from '@/components/options/FunnelStepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLang } from '@/contexts/LangContext'
import { formatMomoAmount, momoAmountXaf, momoParts } from '@/data/momoAmounts'
import { PACKAGES, formatPackagePrice } from '@/data/packages'
import { readLeadDraft, storeLead, updateLeadDraft } from '@/lib/lead'

export function OptionsBrief() {
  const { t, lang } = useLang()
  const [params] = useSearchParams()
  const draft = readLeadDraft()
  const formule = params.get('formule') || draft?.formule
  const pkg = PACKAGES.find((item) => item.id === formule)
  const [name, setName] = useState(draft?.brief?.name ?? '')
  const [rooms, setRooms] = useState(draft?.brief?.rooms ?? '')
  const [city, setCity] = useState(draft?.brief?.city ?? '')
  const [notes, setNotes] = useState(draft?.brief?.notes ?? '')
  const [nameError, setNameError] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'local'>('idle')

  if (!draft || !draft.paymentAttempted || draft.formule !== formule || !pkg) {
    const fallback = draft?.optionsReady
      ? `/options/paiement?formule=${draft.formule}`
      : `/options?formule=${formule || 'essentiel'}`
    return <Navigate to={fallback} replace />
  }

  const lead = draft
  const formulaName = t(pkg.nameKey)
  const modeLabel = lead.visit ? t('options.mode.visit') : t('options.mode.supplied')
  const euro = formatPackagePrice(lead.visit ? pkg.visitPrice : pkg.price, lang)
  const xaf = momoAmountXaf(lead.formule, lead.visit)
  const parts = xaf == null ? [] : momoParts(xaf)
  const total = xaf == null ? euro : formatMomoAmount(xaf, lang)
  const momoLine = parts.length > 1
    ? (lang === 'fr'
      ? `${total}. Acompte demandé : ${formatMomoAmount(parts[0], lang)}. Solde à la livraison : ${formatMomoAmount(xaf! - parts[0], lang)}`
      : `${total}. Deposit requested: ${formatMomoAmount(parts[0], lang)}. Balance on delivery: ${formatMomoAmount(xaf! - parts[0], lang)}`)
    : total
  const hint = lead.visit ? t('options.brief.visit') : t('options.brief.supplied')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (name.trim().length < 2) {
      setNameError(true)
      return
    }
    setStatus('loading')
    const brief = { name: name.trim(), rooms: rooms.trim(), city: city.trim(), notes: notes.trim() }
    updateLeadDraft({ brief })
    const payLabel = lead.paymentMethod === 'orange' ? 'Orange Money' : 'MTN Mobile Money'
    const message = lang === 'fr'
      ? `Brief. Formule : ${formulaName}. Mode : ${modeLabel}. Prix affiché : ${euro}. Mobile Money : ${momoLine}. Nom : ${brief.name}. Ville : ${brief.city || 'non précisée'}. Activité : ${brief.rooms || 'non précisée'}. Nom de l’activité : ${lead.hotel || 'non précisé'}. Email : ${lead.email}. Téléphone : ${lead.phone || 'non précisé'}. Paiement : ${payLabel}, transfert non confirmé sur ce site. Référence : ${lead.paymentReference || 'aucune'}. Notes : ${brief.notes || 'aucune'}.`
      : `Brief. Package: ${formulaName}. Mode: ${modeLabel}. Listed price: ${euro}. Mobile Money: ${momoLine}. Name: ${brief.name}. City: ${brief.city || 'not given'}. Activity: ${brief.rooms || 'not given'}. Activity name: ${lead.hotel || 'not given'}. Email: ${lead.email}. Phone: ${lead.phone || 'not given'}. Payment: ${payLabel}, transfer not confirmed on this site. Reference: ${lead.paymentReference || 'none'}. Notes: ${brief.notes || 'none'}.`
    const saved = await storeLead({
      hotel: lead.hotel || brief.name,
      email: lead.email,
      phone: lead.phone,
      formule: lead.formule,
      message,
    })
    setStatus(saved ? 'saved' : 'local')
  }

  return (
    <main className="pt-24 pb-16 bg-muted/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <FunnelStepper current={4} />
      </div>
      <div className="max-w-lg mx-auto px-4">
        <Link to={`/options/paiement?formule=${lead.formule}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('options.step.pay')}
        </Link>
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">{t('options.brief.title')}</h1>
          <p className="text-sm text-muted-foreground mb-2">{t('options.brief.lead')}</p>
          <p className="text-sm text-muted-foreground mb-6">{hint}</p>

          <div className="rounded-2xl bg-muted/60 px-4 py-3 mb-6 text-sm">
            <p className="font-semibold">{formulaName}</p>
            <p className="text-muted-foreground">{modeLabel} · {total}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="brief-name">{t('options.brief.name')}</Label>
              <Input id="brief-name" value={name} onChange={(event) => { setName(event.target.value); setNameError(false) }} disabled={status === 'loading' || status === 'saved'} />
              {nameError && <p className="text-xs text-destructive">{t('options.brief.err.name')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brief-city">
                {t('options.brief.city')}
                <span className="text-muted-foreground font-normal"> · {t('options.optional')}</span>
              </Label>
              <Input id="brief-city" value={city} onChange={(event) => setCity(event.target.value)} placeholder={t('options.brief.city.placeholder')} disabled={status === 'loading' || status === 'saved'} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brief-rooms">
                {t('options.brief.rooms')}
                <span className="text-muted-foreground font-normal"> · {t('options.optional')}</span>
              </Label>
              <Input id="brief-rooms" value={rooms} onChange={(event) => setRooms(event.target.value)} placeholder={t('options.brief.rooms.placeholder')} disabled={status === 'loading' || status === 'saved'} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brief-notes">
                {t('options.brief.notes')}
                <span className="text-muted-foreground font-normal"> · {t('options.optional')}</span>
              </Label>
              <Textarea id="brief-notes" value={notes} onChange={(event) => setNotes(event.target.value)} disabled={status === 'loading' || status === 'saved'} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6">{t('options.brief.paynote')}</p>
          <Button type="submit" className="w-full rounded-full h-12 mt-4" disabled={status === 'loading' || status === 'saved'}>
            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('options.brief.send')}
          </Button>
          {status === 'saved' && <p className="text-sm text-primary mt-3">{t('options.brief.saved')}</p>}
          {status === 'local' && <p className="text-sm mt-3">{t('options.brief.local')}</p>}
        </form>
      </div>
    </main>
  )
}
