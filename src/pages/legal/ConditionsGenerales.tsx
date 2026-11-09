import { LegalLayout } from './LegalLayout'

export function ConditionsGenerales() {
  return (
    <LegalLayout>
      <div>
        <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-3">Légal</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">Conditions générales</h1>
      </div>

      <div className="space-y-8 text-muted-foreground leading-7">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Objet</h2>
          <p>
            Les présentes conditions régissent la création d’un site web pour une activité,
            vendu par Newzephyr sous l’une des trois formules. Si le client envoie les textes
            et les photos : Découverte (449 €, 7 jours), Essentiel (990 €, 21 jours), Complet
            (2 990 €, 30 jours). Si Newzephyr vient sur place photographier et écrire : Découverte
            (649 €), Essentiel (1 490 €), Complet (3 990 €), aux mêmes délais. À Yaoundé, la venue est
            dans le prix. Hors Yaoundé, le déplacement se chiffre à part, avant l’acompte.
            Un hôtel, un restaurant ou un salon suivent la même formule.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Délai</h2>
          <p>
            Si le client envoie les textes et les photos, le délai commence le jour où l’acompte,
            les textes et les photos sont reçus. Un retard du client sur ces éléments décale le
            délai d’autant. Si Newzephyr vient sur place, le délai commence le lendemain de la visite,
            une fois l’acompte payé. Si le client reporte la visite, le délai se décale d’autant.
            Les textes et les photos publiés dans ce cas décrivent ce qui a été vu sur place.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Garantie de délai</h2>
          <p>
            Chaque formule inclut deux retouches. Il n’y a pas de remboursement. Si le délai est
            dépassé du fait de Newzephyr, le mois d’hébergement suivant la première année est offert.
            Cette règle ne porte pas sur un nombre de demandes ou un chiffre d’affaires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Paiement</h2>
          <p>
            Un acompte est demandé au démarrage. Le solde est payable à la livraison. L’acompte peut
            se régler par MTN Mobile Money ou par Orange Money. Un paiement Mobile Money est limité
            à 500 000 FCFA. Au-dessus, le prix est découpé en parts de ce montant : la première est
            l’acompte, les suivantes sont le solde. Le montant demandé est celui affiché sur la page
            de paiement. Le site ne prélève rien tout seul.
            Si le paiement n’est pas encore ouvert, aucun montant n’est débité. Le transfert est
            confirmé lorsqu’il est vu sur le compte. Le devis est valable 30 jours. Le nom de domaine
            .com et l’hébergement de la première année sont inclus. Une extension locale se paie au
            tarif du registrar.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Propriété</h2>
          <p>
            Le transfert des droits sur le site livré s’effectue après paiement total. Jusqu’à
            complet paiement, les livrables restent la propriété de Newzephyr.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
