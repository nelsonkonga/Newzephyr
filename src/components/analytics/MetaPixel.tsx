import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/lib/metaPixel'

export function MetaPixel() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  return null
}
