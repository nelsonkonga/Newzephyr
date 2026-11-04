import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLang } from '@/contexts/LangContext'
import { cn } from '@/lib/utils'

interface BookCallButtonProps {
  className?: string
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  tone?: 'primary' | 'secondary'
}

export function BookCallButton({
  className,
  size = 'lg',
  fullWidth = false,
  tone = 'primary',
}: BookCallButtonProps) {
  const { t } = useLang()
  const primary = tone === 'primary'

  return (
    <Button
      variant={primary ? 'default' : 'secondary'}
      size={size}
      className={cn(
        'h-16 rounded-full pl-7 pr-2 text-lg font-semibold',
        primary && 'shadow-[0_8px_20px_rgba(59,108,246,0.18)]',
        fullWidth && 'w-full',
        className,
      )}
      asChild
    >
      <Link to="/appel">
        {t('cta.book')}
        <span className={cn(
          'ml-3 inline-flex h-12 w-12 items-center justify-center rounded-full',
          primary ? 'bg-white/10' : 'bg-foreground/5',
        )}>
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </Button>
  )
}
