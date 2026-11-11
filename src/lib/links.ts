export const WHATSAPP_NUMBER = '237659300327'

export const SOCIAL = {
  instagram: 'https://www.instagram.com/newzephyr.co',
  facebook: 'https://web.facebook.com/newzephyr.co',
} as const

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function bookCallMessage(lang: 'fr' | 'en') {
  return lang === 'fr'
    ? 'Bonjour Newzephyr, je souhaite réserver un appel de 20 minutes pour le site web de mon activité.'
    : 'Hello Newzephyr, I would like to book a 20-minute call about a website for my business.'
}
