import React, { createContext, useContext, useState } from 'react'

export type Lang = 'fr' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const translations: Record<string, Record<Lang, string>> = {
  'nav.offer': { fr: 'Création de site web', en: 'Website creation' },
  'nav.examples': { fr: 'Parcours', en: 'Journeys' },
  'nav.method': { fr: 'Déroulement', en: 'Process' },
  'nav.pricing': { fr: 'Tarifs', en: 'Pricing' },
  'nav.faq': { fr: 'Questions', en: 'FAQ' },
  'nav.about': { fr: 'À propos', en: 'About' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },
  'nav.cta': { fr: 'Réserver un appel', en: 'Book a call' },

  'cta.book': { fr: 'Réserver un appel de 20 min', en: 'Book a 20-min call' },
  'cta.pricing': { fr: 'Voir les formules', en: 'See the packages' },
  'call.title': { fr: 'Réserver un appel de 20 minutes', en: 'Book a 20-minute call' },
  'call.lead': {
    fr: 'Cet appel sert à choisir la formule. Rien à payer sur cette page.',
    en: 'This call is for choosing the package. Nothing to pay on this page.',
  },
  'call.missing': {
    fr: 'Les créneaux ne sont pas encore ouverts. Écrivez à nelo.engineering@hotmail.com pour fixer l’appel.',
    en: 'The time slots are not open yet. Write to nelo.engineering@hotmail.com to set the call.',
  },
  'cta.instagram': { fr: 'Instagram', en: 'Instagram' },
  'cta.linkedin': { fr: 'LinkedIn', en: 'LinkedIn' },
  'cta.whatsapp': { fr: 'WhatsApp', en: 'WhatsApp' },

  'hero.badge': { fr: 'Toutes les activités', en: 'Every activity' },
  'hero.title': {
    fr: 'Création de site web, {em}une semaine{/em} dès 449\u00A0€.',
    en: 'Website creation, {em}in one week{/em} from €449.',
  },
  'hero.subtitle': {
    fr: 'Création de site web pour toute activité. Découverte en 7 jours, Essentiel en 21 jours, Complet en 30 jours. Le prix et le délai sont sur cette page. Vous envoyez les textes et les photos, ou nous venons les faire sur place.',
    en: 'Website creation for any activity. Discovery in 7 days, Essential in 21 days, Complete in 30 days. The price and the deadline are on this page. You send the texts and photos, or we come on site to make them.',
  },
  'hero.trust1': { fr: 'Un seul service', en: 'One service' },
  'hero.trust2': { fr: 'Délai écrit', en: 'A written deadline' },
  'hero.trust3': { fr: 'Deux retouches', en: 'Two revisions' },
  'hero.visual.aria': {
    fr: 'Une demande arrive sur le site. Le prix et le délai sont écrits.',
    en: 'A request arrives on the website. The price and the deadline are written.',
  },
  'hero.visual.name': { fr: 'Votre activité', en: 'Your activity' },
  'hero.visual.page': { fr: 'Une page, une galerie, un formulaire', en: 'One page, one gallery, one form' },
  'hero.visual.request': { fr: 'Demande', en: 'Request' },
  'hero.visual.requestSample': { fr: 'Un client écrit ici', en: 'A customer writes here' },
  'hero.visual.send': { fr: 'Envoyer', en: 'Send' },
  'hero.visual.received': { fr: 'Demande reçue', en: 'Request received' },
  'hero.visual.site': { fr: 'Sur votre site', en: 'On your site' },
  'hero.visual.delay': { fr: 'Une semaine', en: 'One week' },
  'hero.visual.delayValue': { fr: '7 jours', en: '7 days' },
  'hero.visual.from': { fr: 'dès 449 €', en: 'from €449' },
  'hero.visual.fuzzy': { fr: 'Délai flou', en: 'A fuzzy deadline' },

  'problem.eyebrow': { fr: 'Le constat', en: 'The picture' },
  'problem.title': {
    fr: 'Une agence classique chiffre après des réunions, avec un {em}délai flou{/em}.',
    en: 'A classic agency quotes after meetings, with {em}a fuzzy deadline{/em}.',
  },
  'problem.lead': {
    fr: 'Comptez souvent 3 à 4 semaines, dès 3 000 €. Le prix n’est pas écrit avant les réunions.',
    en: 'Count on 3 to 4 weeks, from €3,000. The price is not written before the meetings.',
  },
  'problem.p1': {
    fr: 'Le devis arrive après les réunions.',
    en: 'The quote arrives after the meetings.',
  },
  'problem.p2': {
    fr: 'Le délai n’est pas fixé au départ.',
    en: 'The deadline is not set at the start.',
  },
  'problem.p3': {
    fr: 'Le site, quand il existe, montre l’activité. Il ne reçoit pas la demande.',
    en: 'When a website exists, it shows the activity. It does not receive the request.',
  },

  'compare.eyebrow': { fr: 'Avant / après', en: 'Before / after' },
  'compare.title': {
    fr: 'La même activité, avec {em}le prix et le délai{/em} sur la page.',
    en: 'The same activity, with {em}the price and the deadline{/em} on the page.',
  },
  'compare.before': { fr: 'Agence classique', en: 'A classic agency' },
  'compare.after': { fr: 'Newzephyr', en: 'Newzephyr' },
  'compare.b1': { fr: 'Devis après des réunions.', en: 'A quote after meetings.' },
  'compare.a1': { fr: 'Le prix est sur la page.', en: 'The price is on the page.' },
  'compare.b2': { fr: 'Délai flou, souvent 3 à 4 semaines.', en: 'A fuzzy deadline, often 3 to 4 weeks.' },
  'compare.a2': { fr: '7, 21 ou 30 jours, écrits.', en: '7, 21 or 30 days, written down.' },
  'compare.b3': { fr: 'Dès 3 000 €.', en: 'From €3,000.' },
  'compare.a3': { fr: 'Dès 449 €.', en: 'From €449.' },
  'compare.b4': { fr: 'Pas d’endroit pour envoyer une demande.', en: 'Nowhere to send a request.' },
  'compare.a4': { fr: 'Un formulaire reçoit la demande.', en: 'A form receives the request.' },

  'offer.eyebrow': { fr: 'L’offre', en: 'The offer' },
  'offer.title': { fr: 'Création de site web. Le prix et le délai sont écrits.', en: 'Website creation. The price and the deadline are written.' },
  'offer.lead': {
    fr: 'Salon, restaurant, hôtel ou boutique. Le client écrit sa demande sur le site. La formule part dans le délai annoncé.',
    en: 'A salon, restaurant, hotel or shop. The customer writes the request on the site. The package starts on the announced deadline.',
  },
  'offer.forWho': { fr: 'Pour qui', en: 'For whom' },
  'offer.forWho.value': { fr: 'Toute activité qui veut un site web', en: 'Any activity that wants a website' },
  'offer.result': { fr: 'Quel résultat', en: 'What result' },
  'offer.result.value': { fr: 'Un site qui reçoit la demande', en: 'A website that receives the request' },
  'offer.how': { fr: 'Comment', en: 'How' },
  'offer.how.value': { fr: 'Livré en 7, 21 ou 30 jours', en: 'Delivered in 7, 21 or 30 days' },
  'offer.b1.title': { fr: 'Pour toute activité', en: 'For any activity' },
  'offer.b1.desc': {
    fr: 'Un salon, un restaurant, un hôtel ou une boutique. La formule est la même.',
    en: 'A salon, a restaurant, a hotel or a shop. The package is the same.',
  },
  'offer.b2.title': { fr: 'Le délai est écrit avant l’appel', en: 'The deadline is written before the call' },
  'offer.b2.desc': {
    fr: '7, 21 ou 30 jours selon la formule. Le délai part à la réception de vos contenus, ou le lendemain de la venue sur place.',
    en: '7, 21 or 30 days depending on the package. The deadline starts when your content arrives, or the day after the on-site visit.',
  },
  'offer.b3.title': { fr: 'Deux retouches', en: 'Two revisions' },
  'offer.b3.desc': {
    fr: 'Elles sont incluses. Il n’y a pas de remboursement.',
    en: 'They are included. There is no refund.',
  },
  'offer.b4.title': { fr: 'Le prix est sur cette page', en: 'The price is on this page' },
  'offer.b4.desc': {
    fr: '449 €, 990 € ou 2 990 € si vous envoyez les contenus. 649 €, 1 490 € ou 3 990 € si nous venons sur place.',
    en: '€449, €990 or €2,990 if you send the content. €649, €1,490 or €3,990 if we come on site.',
  },

  'method.eyebrow': { fr: 'Déroulement', en: 'Process' },
  'method.title': { fr: 'Quatre étapes. {em}Le délai{/em} commence quand vous êtes prêt.', en: 'Four steps. {em}The deadline{/em} starts when you are ready.' },
  'method.subtitle': {
    fr: 'Appel de 20 minutes, acompte, livraison, mise en ligne.',
    en: 'A 20-minute call, a deposit, delivery, go-live.',
  },
  'method.s1.title': { fr: 'Appel de 20 minutes', en: '20-minute call' },
  'method.s1.desc': {
    fr: 'On choisit la formule, et si vous envoyez les contenus ou si nous venons sur place.',
    en: 'We choose the package, and whether you send the content or we come on site.',
  },
  'method.s2.title': { fr: 'Acompte', en: 'Deposit' },
  'method.s2.desc': {
    fr: 'Si vous envoyez les contenus, le délai part le jour où l’acompte, les textes et les photos sont reçus. Si nous venons sur place, il part le lendemain de la visite, une fois l’acompte payé.',
    en: 'If you send the content, the deadline starts the day the deposit, texts and photos arrive. If we come on site, it starts the day after the visit, once the deposit is paid.',
  },
  'method.s3.title': { fr: 'Livraison', en: 'Delivery' },
  'method.s3.desc': {
    fr: '7 jours en Découverte, 21 jours en Essentiel, 30 jours en Complet. Deux retouches sont incluses.',
    en: '7 days for Discovery, 21 days for Essential, 30 days for Complete. Two revisions are included.',
  },
  'method.s4.title': { fr: 'Mise en ligne', en: 'Go-live' },
  'method.s4.desc': {
    fr: 'Vous validez. Le solde est dû à la livraison. Le nom de domaine et l’hébergement de la première année sont dans la formule.',
    en: 'You approve. The balance is due on delivery. The domain name and the first year of hosting are in the package.',
  },

  'scenarios.eyebrow': { fr: 'Les formules', en: 'The packages' },
  'scenarios.title': { fr: 'Trois points de départ, {em}une formule{/em} chacun.', en: 'Three starting points, {em}one package{/em} each.' },
  'scenarios.s1.kicker': { fr: 'Formule Découverte', en: 'Discovery package' },
  'scenarios.s1.title': { fr: 'L’activité qui n’a pas encore de site', en: 'The activity that does not have a website yet' },
  'scenarios.s1.body': {
    fr: 'Découverte pose une page, une galerie et un formulaire. Délai : 7 jours.',
    en: 'Discovery sets up a page, a gallery and a form. Deadline: 7 days.',
  },
  'scenarios.s2.kicker': { fr: 'Formule Essentiel', en: 'Essential package' },
  'scenarios.s2.title': { fr: 'L’activité qui veut la demande sur son site', en: 'The activity that wants the request on its site' },
  'scenarios.s2.body': {
    fr: 'Essentiel ajoute les disponibilités et le formulaire de demande, en français et en anglais. Délai : 21 jours.',
    en: 'Essential adds availability and the request form, in French and English. Deadline: 21 days.',
  },
  'scenarios.s3.kicker': { fr: 'Formule Complet', en: 'Complete package' },
  'scenarios.s3.title': { fr: 'L’activité qui veut encaisser au moment de la demande', en: 'The activity that wants payment when the request is made' },
  'scenarios.s3.body': {
    fr: 'Complet ajoute le paiement carte ou Mobile Money, le compte et l’historique. Délai : 30 jours.',
    en: 'Complete adds card or Mobile Money payment, the account and the history. Deadline: 30 days.',
  },

  'tarifs.eyebrow': { fr: 'Tarifs', en: 'Pricing' },
  'tarifs.title': { fr: 'Trois formules, {em}un prix écrit{/em}.', en: 'Three packages, {em}a written price{/em}.' },
  'tarifs.subtitle': {
    fr: 'Pour toute activité. Découverte en 7 jours, Essentiel en 21 jours, Complet en 30 jours.',
    en: 'For any activity. Discovery in 7 days, Essential in 21 days, Complete in 30 days.',
  },
  'tarifs.back': { fr: 'Retour à l’accueil', en: 'Back to home' },
  'tarifs.withVisit': { fr: 'Avec venue : {price}', en: 'With a visit: {price}' },
  'tarifs.delay': { fr: 'Livré en {n} jours', en: 'Delivered in {n} days' },
  'tarifs.revisions': { fr: '2 retouches incluses', en: '2 revisions included' },
  'tarifs.includedTitle': { fr: 'Inclus', en: 'Included' },
  'tarifs.cta': { fr: 'Voir les options', en: 'View options' },
  'tarifs.mode.label': { fr: 'Qui prépare les textes et les photos', en: 'Who prepares the texts and photos' },
  'tarifs.mode.supplied': { fr: 'Vous envoyez les contenus', en: 'You send the content' },
  'tarifs.mode.visit': { fr: 'Nous venons sur place', en: 'We come on site' },
  'tarifs.visit.note': {
    fr: 'Les textes et les photos publiés décrivent ce que nous avons vu sur place.',
    en: 'The published texts and photos describe what we saw on site.',
  },
  'tarifs.visit.yaounde': {
    fr: 'À Yaoundé, la venue est dans le prix affiché.',
    en: 'In Yaoundé, the visit is included in the listed price.',
  },
  'tarifs.visit.outside': {
    fr: 'Hors Yaoundé, le déplacement se chiffre à part, avant l’acompte.',
    en: 'Outside Yaoundé, travel is quoted separately, before the deposit.',
  },
  'tarifs.pkg.decouverte.name': { fr: 'Découverte', en: 'Discovery' },
  'tarifs.pkg.decouverte.tagline': {
    fr: 'Une page, une galerie et un formulaire, pour recevoir un premier contact.',
    en: 'One page, one gallery and one form, to receive a first contact.',
  },
  'tarifs.pkg.decouverte.f1': {
    fr: 'Une page',
    en: 'One page',
  },
  'tarifs.pkg.decouverte.f2': {
    fr: 'Une galerie',
    en: 'One gallery',
  },
  'tarifs.pkg.decouverte.f3': {
    fr: 'Un formulaire',
    en: 'One form',
  },
  'tarifs.pkg.decouverte.f4': {
    fr: 'Nom de domaine .com et hébergement, première année',
    en: '.com domain and hosting, first year',
  },
  'tarifs.pkg.essentiel.name': { fr: 'Essentiel', en: 'Essential' },
  'tarifs.pkg.essentiel.tagline': {
    fr: 'Tout Découverte, plus les disponibilités et le formulaire de demande, en français et en anglais.',
    en: 'Everything in Discovery, plus availability and the request form, in French and English.',
  },
  'tarifs.pkg.essentiel.includedHeader': {
    fr: 'Tout Découverte, plus :',
    en: 'Everything in Discovery, plus:',
  },
  'tarifs.pkg.essentiel.f1': {
    fr: 'Les disponibilités',
    en: 'Availability',
  },
  'tarifs.pkg.essentiel.f2': {
    fr: 'Le formulaire de demande',
    en: 'The request form',
  },
  'tarifs.pkg.essentiel.f3': {
    fr: 'Français et anglais',
    en: 'French and English',
  },
  'tarifs.pkg.complet.name': { fr: 'Complet', en: 'Complete' },
  'tarifs.pkg.complet.tagline': {
    fr: 'Tout Essentiel, plus le paiement sur le site, le compte et l’historique.',
    en: 'Everything in Essential, plus payment on the site, the account and the history.',
  },
  'tarifs.pkg.complet.includedHeader': {
    fr: 'Tout Essentiel, plus :',
    en: 'Everything in Essential, plus:',
  },
  'tarifs.pkg.complet.f1': {
    fr: 'Paiement carte ou Mobile Money',
    en: 'Card or Mobile Money payment',
  },
  'tarifs.pkg.complet.f2': {
    fr: 'Compte et historique',
    en: 'Account and history',
  },

  'guarantee.title': { fr: 'Deux retouches', en: 'Two revisions' },
  'guarantee.supplied': {
    fr: 'Deux retouches sont incluses. Il n’y a pas de remboursement. Si le délai de la formule est dépassé de notre fait, le mois d’hébergement suivant est offert. Le délai part le jour où l’acompte, les textes et les photos sont reçus. S’il y a une venue, il part le lendemain de la visite, une fois l’acompte payé. Si vous reportez la venue, le délai se décale d’autant.',
    en: 'Two revisions are included. There is no refund. If we miss the package deadline, the following month of hosting is free. The deadline starts the day the deposit, the texts and the photos are received. If there is a visit, it starts the day after the visit, once the deposit is paid. If you postpone the visit, the deadline moves by the same amount.',
  },
  'tarifs.domain.note': {
    fr: 'Le nom de domaine .com et l’hébergement de la première année sont dans chaque formule. Une extension locale (.cm) se chiffre à part, au tarif du registrar.',
    en: 'The .com domain and the first year of hosting are in every package. A local extension (.cm) is quoted separately, at the registrar’s price.',
  },
  'faq.eyebrow': { fr: 'Questions', en: 'Questions' },
  'faq.title': { fr: 'Avant {em}l’appel{/em}.', en: 'Before {em}the call{/em}.' },
  'faq.q1': { fr: 'Pour qui est cette offre ?', en: 'Who is this offer for?' },
  'faq.a1': {
    fr: 'Toute activité qui veut une création de site web. Un hôtel, un restaurant, un salon ou une boutique suivent la même formule.',
    en: 'Any activity that wants a website created. A hotel, a restaurant, a salon or a shop take the same package.',
  },
  'faq.q2': { fr: 'Le délai part quand ?', en: 'When does the deadline start?' },
  'faq.a2': {
    fr: 'Si vous envoyez les contenus, le jour où l’acompte, les textes et les photos sont reçus. Si nous venons sur place, le lendemain de la visite, une fois l’acompte payé. Découverte : 7 jours. Essentiel : 21 jours. Complet : 30 jours.',
    en: 'If you send the content, the day the deposit, texts and photos arrive. If we come on site, the day after the visit, once the deposit is paid. Discovery: 7 days. Essential: 21 days. Complete: 30 days.',
  },
  'faq.q3': { fr: 'Qui fournit les textes et les photos ?', en: 'Who provides the texts and the photos?' },
  'faq.a3': {
    fr: 'Vous, ou nous. Si vous les envoyez, le délai attend leur réception avec l’acompte. Si nous venons sur place, nous photographions et nous écrivons d’après ce que nous avons vu. Ce qui n’a pas été vu n’est pas publié. À Yaoundé, la venue est dans le prix. Hors Yaoundé, le déplacement se chiffre à part.',
    en: 'You, or us. If you send them, the deadline waits for them together with the deposit. If we come on site, we photograph and write from what we saw. What was not seen is not published. In Yaoundé, the visit is included in the price. Outside Yaoundé, travel is quoted separately.',
  },
  'faq.q4': { fr: 'Que se passe-t-il si le délai n’est pas tenu ?', en: 'What if the deadline is missed?' },
  'faq.a4': {
    fr: 'S’il est dépassé de notre fait, le mois d’hébergement suivant est offert. Un retard de votre côté sur les contenus, ou un report de la visite, décale le délai d’autant.',
    en: 'If we miss it, the following month of hosting is free. A delay on your side for the content, or a postponed visit, moves the deadline by the same amount.',
  },
  'faq.q6': { fr: 'Comment se paie le site ?', en: 'How is the website paid for?' },
  'faq.a6': {
    fr: 'Un acompte au démarrage, par MTN Mobile Money ou Orange Money. Un paiement est limité à 500 000 FCFA, donc le prix est découpé en parts de ce montant. Le solde se paie à la livraison. Le devis reste valable 30 jours.',
    en: 'A deposit at the start, by MTN Mobile Money or Orange Money. One payment is limited to 500,000 FCFA, so the price is split into parts of that amount. The balance is paid on delivery. The quote stays valid for 30 days.',
  },
  'faq.q7': { fr: 'Y a-t-il un remboursement ?', en: 'Is there a refund?' },
  'faq.a7': {
    fr: 'Non. Deux retouches sont incluses. Si le délai est dépassé de notre fait, le mois d’hébergement suivant est offert.',
    en: 'No. Two revisions are included. If we miss the deadline, the following month of hosting is free.',
  },

  'about.eyebrow': { fr: 'À propos', en: 'About' },
  'about.title': { fr: 'Newzephyr', en: 'Newzephyr' },
  'about.role': { fr: 'Création de site web', en: 'Website creation' },
  'about.location': { fr: 'Nelson, à Yaoundé', en: 'Nelson, in Yaoundé' },
  'about.bio': {
    fr: 'Je fais la création de site web pour toute activité, en 7, 21 ou 30 jours. Une personne. Vous envoyez les textes et les photos, ou je viens sur place les faire. Ce qui est publié décrit ce qui a été vu ou reçu. L’appel de 20 minutes sert à choisir la formule.',
    en: 'I create websites for any activity, in 7, 21 or 30 days. One person. You send the texts and photos, or I come on site to make them. What is published describes what was seen or received. The 20-minute call is for choosing the package.',
  },
  'about.h1': { fr: 'Une formule, un site', en: 'One package, one website' },
  'about.h2': { fr: 'Délai écrit', en: 'Written deadline' },
  'about.h3': { fr: 'Domaine et hébergement la 1re année', en: 'Domain and hosting in year 1' },
  'about.available': { fr: 'Appels ouverts', en: 'Calls open' },

  'options.step1': { fr: '1. Vos informations', en: '1. Your details' },
  'options.step2': { fr: '2. Options', en: '2. Options' },
  'options.step.info': { fr: 'Vos informations', en: 'Your details' },
  'options.step.options': { fr: 'Options', en: 'Options' },
  'options.step.pay': { fr: 'Paiement', en: 'Payment' },
  'options.step.brief': { fr: 'Brief', en: 'Brief' },
  'options.progress': { fr: 'Étapes', en: 'Steps' },
  'options.package': { fr: 'Votre formule', en: 'Your package' },
  'options.from': { fr: 'à partir de', en: 'from' },
  'options.change': { fr: 'Changer', en: 'Change' },
  'options.title': {
    fr: 'Vous êtes à une étape d’un site pour {em}votre activité{/em}.',
    en: 'You are one step away from a website for {em}your activity{/em}.',
  },
  'options.title.resto': {
    fr: 'Vous êtes à une étape d’un devis pour {em}votre restaurant{/em}.',
    en: 'You are one step away from a quote for {em}your restaurant{/em}.',
  },
  'options.lead': {
    fr: 'Dites-nous où envoyer le détail. Rien à payer à cette étape.',
    en: 'Tell us where to send the details. Nothing to pay on this step.',
  },
  'options.hotel': { fr: 'Nom de l’activité', en: 'Activity name' },
  'options.place': { fr: 'Nom de l’établissement', en: 'Place name' },
  'options.place.placeholder': { fr: 'Restaurant du Centre', en: 'Central Restaurant' },
  'options.optional': { fr: 'facultatif', en: 'optional' },
  'options.hotel.placeholder': { fr: 'Atelier Luna', en: 'Luna Studio' },
  'options.email': { fr: 'Email', en: 'Email' },
  'options.email.placeholder': { fr: 'vous@exemple.com', en: 'you@example.com' },
  'options.phone': { fr: 'Téléphone', en: 'Phone' },
  'options.phone.hint': { fr: 'pour vous joindre au sujet du projet', en: 'so we can reach you about the project' },
  'options.see': { fr: 'Voir mes options', en: 'See my options' },
  'options.legal.before': { fr: 'En continuant, vous acceptez les', en: 'By continuing, you agree to the' },
  'options.legal.terms': { fr: 'conditions générales', en: 'terms' },
  'options.legal.and': { fr: 'et la', en: 'and the' },
  'options.legal.privacy': { fr: 'politique de confidentialité', en: 'privacy policy' },
  'options.legal.nospam': { fr: 'Pas de spam.', en: 'No spam.' },
  'options.choice.title': { fr: 'Vos options', en: 'Your options' },
  'options.mode.supplied': { fr: 'Vous envoyez les contenus', en: 'You send the content' },
  'options.mode.supplied.desc': {
    fr: 'Le délai part le jour où l’acompte, les textes et les photos sont reçus.',
    en: 'The deadline starts the day the deposit, the texts and the photos are received.',
  },
  'options.mode.visit': { fr: 'Nous venons sur place', en: 'We come on site' },
  'options.mode.visit.desc': {
    fr: 'Le délai part le lendemain de la visite, une fois l’acompte payé.',
    en: 'The deadline starts the day after the visit, once the deposit is paid.',
  },
  'options.summary': { fr: 'Récapitulatif', en: 'Summary' },
  'options.total': { fr: 'Total', en: 'Total' },
  'options.confirm': { fr: 'Continuer vers le paiement', en: 'Continue to payment' },
  'options.choice.continue': { fr: 'Continuer vers le paiement', en: 'Continue to payment' },
  'options.success': { fr: 'C’est noté. Votre demande est enregistrée.', en: 'Noted. Your request is saved.' },
  'options.error': { fr: 'L’enregistrement n’a pas abouti.', en: 'The request was not saved.' },
  'options.err.email': { fr: 'Indiquez un email valide.', en: 'Add a valid email.' },
  'options.resto.name': { fr: 'Restaurant', en: 'Restaurant' },
  'options.resto.choice': { fr: 'Le restaurant se chiffre à part', en: 'The restaurant is quoted separately' },
  'options.resto.choice.desc': {
    fr: 'Carte en ligne, menu QR, réservation de tables ou click and collect. Le montant se confirme avant tout paiement.',
    en: 'Online menu, QR menu, table booking or click and collect. The amount is confirmed before any payment.',
  },
  'options.pay.title': { fr: 'Paiement', en: 'Payment' },
  'options.pay.method': { fr: 'Moyen de paiement', en: 'Payment method' },
  'options.pay.mtn': { fr: 'MTN Mobile Money', en: 'MTN Mobile Money' },
  'options.pay.mtn.hint': { fr: 'Depuis un compte MTN au Cameroun', en: 'From an MTN account in Cameroon' },
  'options.pay.orange': { fr: 'Orange Money', en: 'Orange Money' },
  'options.pay.orange.hint': { fr: 'Depuis un compte Orange au Cameroun', en: 'From an Orange account in Cameroon' },
  'options.pay.secure': {
    fr: 'Le site ne prélève rien tout seul. Le transfert part de votre compte Mobile Money.',
    en: 'The site does not take money by itself. The transfer leaves your Mobile Money account.',
  },
  'options.pay.continue': { fr: 'Continuer vers le paiement', en: 'Continue to payment' },
  'options.pay.redirecting': { fr: 'Redirection…', en: 'Redirecting…' },
  'options.pay.due': { fr: 'À payer aujourd’hui', en: 'Due today' },
  'options.pay.deposit': { fr: 'Payer l’acompte', en: 'Pay the deposit' },
  'options.pay.balance': { fr: 'Solde à la livraison', en: 'Balance on delivery' },
  'options.pay.cap': {
    fr: 'Un paiement Mobile Money est limité à 500 000 FCFA. Le premier versement est l’acompte.',
    en: 'One Mobile Money payment is limited to 500,000 FCFA. The first payment is the deposit.',
  },
  'options.pay.quote': { fr: 'Devis à part', en: 'Separate quote' },
  'options.pay.error': {
    fr: 'La page de paiement sécurisée n’a pas pu s’ouvrir.',
    en: 'The secure payment page could not be opened.',
  },
  'options.pay.reason.formule': {
    fr: 'Cette formule n’a pas de montant en francs CFA.',
    en: 'This formula has no CFA franc amount.',
  },
  'options.pay.reason.url': {
    fr: 'L’adresse de retour du paiement n’est pas acceptée.',
    en: 'The payment return address was not accepted.',
  },
  'options.pay.reason.email': {
    fr: 'L’email n’est pas accepté pour le paiement.',
    en: 'The email was not accepted for payment.',
  },
  'options.pay.reason.method': {
    fr: 'Choisissez MTN Mobile Money ou Orange Money.',
    en: 'Choose MTN Mobile Money or Orange Money.',
  },
  'options.pay.uncharged': { fr: 'Vous n’avez pas été débité.', en: 'You have not been charged.' },
  'options.pay.send': { fr: 'Envoyez {amount} au {number}.', en: 'Send {amount} to {number}.' },
  'options.pay.motif': { fr: 'Motif', en: 'Reference' },
  'options.pay.seen': {
    fr: 'Le transfert est confirmé seulement quand il apparaît sur le compte.',
    en: 'The transfer is confirmed only when it shows on the account.',
  },
  'options.pay.reference': { fr: 'Référence du transfert', en: 'Transfer reference' },
  'options.pay.brief': { fr: 'Continuer vers le brief', en: 'Continue to the brief' },
  'options.brief.title': { fr: 'Le brief', en: 'The brief' },
  'options.brief.lead': {
    fr: 'Ces précisions préparent le travail. Rien n’est publié tant que ce n’est pas vu ou reçu.',
    en: 'These details prepare the work. Nothing is published until it has been seen or received.',
  },
  'options.brief.name': { fr: 'Votre nom', en: 'Your name' },
  'options.brief.city': { fr: 'Ville', en: 'City' },
  'options.brief.city.placeholder': { fr: 'Yaoundé', en: 'Yaoundé' },
  'options.brief.rooms': { fr: 'Activité', en: 'Activity' },
  'options.brief.rooms.placeholder': { fr: 'Salon, restaurant, hôtel…', en: 'Salon, restaurant, hotel…' },
  'options.brief.notes': { fr: 'Précisions', en: 'Notes' },
  'options.brief.visit': {
    fr: 'Ces notes préparent la visite. Elles ne sont pas publiées telles quelles.',
    en: 'These notes prepare the visit. They are not published as written.',
  },
  'options.brief.supplied': {
    fr: 'Les textes et les photos se transmettent après cette étape.',
    en: 'The texts and photos are sent after this step.',
  },
  'options.brief.restaurant': {
    fr: 'Décrivez la carte, le menu QR, la réservation de tables ou le click and collect.',
    en: 'Describe the menu, the QR menu, table booking or click and collect.',
  },
  'options.brief.send': { fr: 'Envoyer le brief', en: 'Send the brief' },
  'options.brief.saved': { fr: 'C’est noté. Votre demande est enregistrée.', en: 'Noted. Your request is saved.' },
  'options.brief.local': {
    fr: 'Le brief est conservé sur cet appareil. L’enregistrement en base n’est pas encore branché. Vous n’avez pas été débité.',
    en: 'The brief stays on this device. The database is not connected yet. You have not been charged.',
  },
  'options.brief.paynote': {
    fr: 'Cette page ne confirme pas un paiement. Le transfert est confirmé seulement quand il est vu sur le compte.',
    en: 'This page does not confirm a payment. The transfer is confirmed only when it is seen on the account.',
  },
  'options.brief.err.name': { fr: 'Indiquez votre nom.', en: 'Add your name.' },

  'footer.link': { fr: 'Création de site web.', en: 'Website creation.' },
  'footer.desc': {
    fr: 'Pour toutes les activités. 7, 21 ou 30 jours selon la formule.',
    en: 'For every activity. 7, 21 or 30 days depending on the package.',
  },
  'footer.legal': { fr: 'Mentions légales', en: 'Legal notice' },
  'footer.privacy': { fr: 'Confidentialité', en: 'Privacy' },
  'footer.cgu': { fr: 'Conditions générales', en: 'Terms' },
  'footer.copyright': { fr: '© 2026 Newzephyr. Tous droits réservés.', en: '© 2026 Newzephyr. All rights reserved.' },

  'studio.script': { fr: 'Le prix est écrit.', en: 'The price is written.' },
  'studio.booking': { fr: 'Formules ouvertes', en: 'Packages open' },
  'studio.talk': { fr: 'Parlons-en.', en: 'Let’s talk.' },
  'studio.still': { fr: 'Encore une question', en: 'Still a question' },
  'studio.stillLead': {
    fr: 'L’appel de 20 minutes sert à choisir la formule.',
    en: 'The 20-minute call is for choosing the package.',
  },
  'studio.dock': { fr: 'Dès 449 €', en: 'From €449' },
  'studio.menu': { fr: 'Menu', en: 'Menu' },
  'studio.close': { fr: 'Fermer', en: 'Close' },
  'studio.mail': { fr: 'nelo.engineering@hotmail.com', en: 'nelo.engineering@hotmail.com' },
  'studio.line1': { fr: 'Création', en: 'Website' },
  'studio.line2': { fr: 'de site web', en: 'creation' },
  'studio.line3': { fr: 'dès 449 €', en: 'from €449' },
  'studio.scroll': { fr: 'Défiler', en: 'Scroll' },
  'studio.examples': { fr: 'Trois situations', en: 'Three situations' },
  'studio.examplesNote': {
    fr: 'Images d’exemple pour chaque formule. Ce ne sont pas des clients, ni des avis.',
    en: 'Example images for each package. These are not clients, and not reviews.',
  },
  'studio.example': { fr: 'Exemple', en: 'Example' },
  'studio.view': { fr: 'Voir', en: 'View' },
  'studio.explore': { fr: 'Explorer', en: 'Explore' },
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (k) => k,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('nelo-lang') as Lang) ?? 'fr'
  })

  function t(key: string): string {
    return translations[key]?.[lang] ?? key
  }

  function handleSetLang(l: Lang) {
    setLang(l)
    localStorage.setItem('nelo-lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
