import { useState } from 'react'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { HeroSection } from './domains/static/hero/components/HeroSection'
import { NosotrosSection } from './domains/static/nosotros/components/NosotrosSection'
import { ServiciosSection } from './domains/static/servicios/components/ServiciosSection'
import { SolucionesSection } from './domains/static/soluciones/components/SolucionesSection'
import { PlanesSection } from './domains/static/planes/components/PlanesSection'
import { WhatsAppButton } from './domains/reusable/contacto/components/WhatsAppButton'
import { LegalModal } from './domains/static/legal/components/LegalModal'
import { legalData } from './domains/static/legal/data/legalData'

function App() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: null,
  })

  const handleOpenModal = (title, content) => {
    setModalState({
      isOpen: true,
      title,
      content,
    })
  }

  const handleOpenLegal = (tipo) => {
    const data = legalData[tipo]
    if (data) {
      setModalState({
        isOpen: true,
        title: data.title,
        content: data.content,
      })
    }
  }

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NosotrosSection />
        <ServiciosSection />
        <SolucionesSection onOpenModal={handleOpenModal} />
        <PlanesSection />
      </main>
      <Footer onOpenLegal={handleOpenLegal} />
      <WhatsAppButton />
      <LegalModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        content={modalState.content}
      />
    </>
  )
}

export default App
