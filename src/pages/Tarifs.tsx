import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Pricing } from '@/components/sections/Pricing'
import { useLang } from '@/contexts/LangContext'

export function Tarifs() {
  const { t } = useLang()

  return (
    <div className="pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          {t('tarifs.back')}
        </Link>
      </div>
      <Pricing />
    </div>
  )
}
