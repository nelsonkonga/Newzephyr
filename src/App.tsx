import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LangProvider } from '@/contexts/LangContext'
import { Header } from '@/components/layout/Header'
import { DocumentMeta } from '@/components/seo/DocumentMeta'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Methodology } from '@/components/sections/Methodology'
import { Scenarios } from '@/components/sections/Scenarios'
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
import { ReliefBackground } from '@/components/motion/ReliefBackground'
import { CustomCursor } from '@/components/motion/CustomCursor'
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

function Frame({ children }: { children: ReactNode }) {
  const home = useLocation().pathname === '/'
  return (
    <div className={home ? 'nc-shell min-h-screen flex flex-col' : 'min-h-screen bg-background text-foreground flex flex-col'}>
      {home && <ReliefBackground />}
      {home && <CustomCursor />}
      {home ? <div className="nc-page">{children}</div> : children}
    </div>
  )
}

function HomePage() {
  return (
    <main className="nc">
      <Hero />
      <Problem />
      <Scenarios />
      <Methodology />
      <Faq />
      <About />
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
          <Frame>
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
          </Frame>
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  )
}

export default App
