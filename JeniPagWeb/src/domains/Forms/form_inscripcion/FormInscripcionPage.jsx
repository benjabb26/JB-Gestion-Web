import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../layout/Header';
import { Footer } from '../../../layout/Footer';
import { FormInscripcion } from './components/FormInscripcion';
import { LegalModal } from '../../static/legal/components/LegalModal';
import { legalData } from '../../static/legal/data/legalData';
import { WhatsAppButton } from '../../reusable/contacto/components/WhatsAppButton';

export function FormInscripcionPage() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: null,
  });

  const handleOpenLegal = (tipo) => {
    const data = legalData[tipo];
    if (data) {
      setModalState({
        isOpen: true,
        title: data.title,
        content: data.content,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#112842] font-sans antialiased selection:bg-[#af7e35] selection:text-white">
      {/* Navbar Superior Fijo con efecto Liquid Glass */}
      <Header />

      {/* Contenido Principal con espaciado adecuado debajo del navbar fijo */}
      <main className="flex-grow pt-24 sm:pt-28 pb-16 sm:pb-24">
        {/* Barra superior de Breadcrumb / Navegación */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="flex items-center justify-between py-2 border-b border-slate-200/70">
            <Link
              to="/JBImpulsa"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#112842] hover:text-[#af7e35] transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#af7e35] group-hover:border-[#af7e35]/40 group-hover:-translate-x-0.5 transition-all shadow-xs">
                <i className="fas fa-arrow-left text-xs"></i>
              </span>
              <span>Volver a JB Impulsa</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="hover:text-[#112842] transition-colors">Inicio</Link>
              <span className="text-slate-300">/</span>
              <Link to="/JBImpulsa" className="hover:text-[#112842] transition-colors">Cursos</Link>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-[#af7e35]">Preinscripción</span>
            </div>
          </div>
        </div>

        {/* Contenedor del Formulario */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormInscripcion onOpenPrivacyPolicy={() => handleOpenLegal('privacidad')} />
        </div>
      </main>

      {/* Footer Corporativo con soporte para modales legales */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Botón flotante accesible de WhatsApp */}
      <WhatsAppButton />

      {/* Modal emergente legal para términos y privacidad */}
      <LegalModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        content={modalState.content}
      />
    </div>
  );
}

export default FormInscripcionPage;
