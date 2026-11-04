import { LegalLayout } from './LegalLayout'

export function Confidentialite() {
  return (
    <LegalLayout>
      <div>
        <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-3">
          Légal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Politique de Confidentialité
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground leading-7">
        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Collecte des données
          </h2>
          <p>
            Le parcours collecte votre email, le nom de l’activité si vous le
            donnez, le téléphone si vous le donnez, la formule, l’option choisie, votre nom, la ville,
            l’activité, les précisions du brief et, si vous la donnez, la référence du
            transfert Mobile Money. Cela sert à préparer la demande et à rapprocher le paiement.
            Aucun numéro de carte n’est demandé. Aucune donnée n’est collectée à votre insu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Utilisation et Sécurité
          </h2>
          <p>
            Vos données sont destinées exclusivement à Newzephyr. Elles ne sont ni cédées, ni vendues,
            ni transférées à des tiers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Vos droits
          </h2>
          <p>
            Vous disposez d'un droit d'accès, de modification et de suppression de vos données
            personnelles, sur simple demande à{' '}
            <a
              href="mailto:nelo.engineering@hotmail.com"
              className="text-gold hover:underline"
            >
              nelo.engineering@hotmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
