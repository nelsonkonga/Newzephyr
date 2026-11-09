import { Button } from '@/components/ui/button'

export function Octobre() {
  return (
    <main className="px-4 pb-24 pt-28">
      <div className="mx-auto max-w-xl">
        <h1 className="text-4xl font-semibold tracking-tight">Dossier octobre</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Du 6 au 31 octobre. Chaque jour : une image, un carrousel de 4 vues, et un reel.
        </p>
        <Button asChild size="lg" className="mt-8 h-14 rounded-full px-8 text-base">
          <a href="/octobre.zip" download="octobre.zip">
            Télécharger le dossier octobre
          </a>
        </Button>
      </div>
    </main>
  )
}
