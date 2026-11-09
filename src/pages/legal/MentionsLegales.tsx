import { LegalLayout } from './LegalLayout'

export function MentionsLegales() {
  return (
    <LegalLayout>
      <div>
        <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-3">
          Légal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Mentions Légales
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground leading-7">
        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Éditeur du site
          </h2>
          <p>
            Ce site est édité par <strong className="text-foreground">Newzephyr</strong>,
            qui livre des sites web professionnels pour toutes les activités, basé à Yaoundé, Cameroun.
          </p>
          <p>
            Email :{' '}
            <a
              href="mailto:nelo.engineering@hotmail.com"
              className="text-gold hover:underline"
            >
              nelo.engineering@hotmail.com
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Hébergement
          </h2>
          <p>
            Ce site est hébergé par <strong className="text-foreground">Vercel Inc.</strong>
            <br />
            Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
            Propriété intellectuelle
          </h2>
          <p>
            L'ensemble de ce site (structure, contenus, éléments graphiques et code source)
            relève de la législation internationale sur le droit d'auteur. Tous droits de
            reproduction réservés. Toute reproduction, même partielle, est interdite sans
            autorisation écrite préalable de l'éditeur.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
