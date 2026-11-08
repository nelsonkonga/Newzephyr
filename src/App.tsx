import { useEffect } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LangProvider } from '@/contexts/LangContext'
import { Header } from '@/components/layout/Header'
import { DocumentMeta } from '@/components/seo/DocumentMeta'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Offer } from '@/components/sections/Offer'
import { Methodology } from '@/components/sections/Methodology'
import { Scenarios } from '@/components/sections/Scenarios'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { About } from '@/components/sections/About'
import { MentionsLegales } from '@/pages/legal/MentionsLegales'
import { Confidentialite } from '@/pages/legal/Confidentialite'
import { ConditionsGenerales } from '@/pages/legal/ConditionsGenerales'
import { Tarifs } from '@/pages/Tarifs'
import { Options } from '@/pages/Options'
import { OptionsChoice } from '@/pages/OptionsChoice'
import { OptionsPayment } from '@/pages/OptionsPayment'
import { OptionsBrief } from '@/pages/OptionsBrief'
import { BookCall } from '@/pages/BookCall'
import { Octobre } from '@/pages/Octobre'
import { warmCalendly } from '@/lib/calendly'
import './index.css'

function WarmCalendly() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/appel') return
    const id = window.requestIdleCallback(() => warmCalendly(), { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }, [pathname])

  return null
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Problem />
      <BeforeAfter />
      <Offer />
      <Pricing />
      <Scenarios />
      <Methodology />
      <About />
      <Faq />
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <BrowserRouter>
          <DocumentMeta />
          <WarmCalendly />
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tarifs" element={<Tarifs />} />
                <Route path="/appel" element={<BookCall />} />
                <Route path="/options" element={<Options />} />
                <Route path="/options/choix" element={<OptionsChoice />} />
                <Route path="/options/paiement" element={<OptionsPayment />} />
                <Route path="/options/brief" element={<OptionsBrief />} />
                <Route path="/portfolio" element={<Navigate to="/#exemples" replace />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                <Route path="/octobre" element={<Octobre />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  )
}

export default App
