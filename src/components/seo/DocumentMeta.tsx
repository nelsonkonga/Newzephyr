import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ORIGIN = 'https://www.newzephyr.co'

const HOME_TITLE = 'Création de site web professionnel | Newzephyr'
const HOME_DESCRIPTION =
  'Obtenez le site qui reçoit la demande. Prix écrit plus bas : création de site web dès 449 €, livrée en 7, 21 ou 30 jours. Deux retouches. Vous envoyez les textes et les photos.'

type PageMeta = {
  title: string
  description: string
  canonical: string
  robots: string
}

function metaFor(pathname: string): PageMeta {
  if (pathname === '/' || pathname === '/tarifs') {
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      canonical: `${ORIGIN}/`,
      robots: 'index, follow',
    }
  }

  if (pathname === '/appel') {
    return {
      title: 'Réserver un appel de 20 minutes | Newzephyr',
      description: 'Appel de 20 minutes pour choisir la formule. Rien à payer sur cette page.',
      canonical: `${ORIGIN}/appel`,
      robots: 'index, follow',
    }
  }

  if (pathname === '/mentions-legales') {
    return {
      title: 'Mentions légales | Newzephyr',
      description: 'Mentions légales de Newzephyr, création de site web.',
      canonical: `${ORIGIN}/mentions-legales`,
      robots: 'index, follow',
    }
  }

  if (pathname === '/confidentialite') {
    return {
      title: 'Confidentialité | Newzephyr',
      description: 'Politique de confidentialité de Newzephyr.',
      canonical: `${ORIGIN}/confidentialite`,
      robots: 'index, follow',
    }
  }

  if (pathname === '/conditions-generales') {
    return {
      title: 'Conditions générales | Newzephyr',
      description: 'Conditions générales de la création de site web Newzephyr. Prix et délais écrits.',
      canonical: `${ORIGIN}/conditions-generales`,
      robots: 'index, follow',
    }
  }

  return {
    title: 'Newzephyr',
    description: HOME_DESCRIPTION,
    canonical: `${ORIGIN}${pathname}`,
    robots: 'noindex, follow',
  }
}

function setContent(selector: string, content: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute('content', content)
}

export function DocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = metaFor(pathname)
    document.title = meta.title
    setContent('meta[name="description"]', meta.description)
    setContent('meta[name="robots"]', meta.robots)
    setContent('meta[property="og:title"]', meta.title)
    setContent('meta[property="og:description"]', meta.description)
    setContent('meta[property="og:url"]', meta.canonical)
    setContent('meta[name="twitter:title"]', meta.title)
    setContent('meta[name="twitter:description"]', meta.description)
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.canonical)
  }, [pathname])

  return null
}
