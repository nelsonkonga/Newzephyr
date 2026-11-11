import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Rise } from '@/components/motion/Rise'
import { useLang } from '@/contexts/LangContext'

export function LegalLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLang()

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>
        <Rise>
          <div className="nc-legal space-y-8">{children}</div>
        </Rise>
      </div>
    </div>
  )
}
