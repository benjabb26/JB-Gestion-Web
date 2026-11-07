import { useState, useEffect, isValidElement } from 'react'
import { contactoData } from '../../../reusable/contacto/data/contactoData'

export function LegalModal({ isOpen, onClose, title, content }) {
  // Estados para animación de entrada y salida súper fluida
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timer
    if (isOpen) {
      setIsRendered(true)
      // Disparar animación de entrada en el siguiente cuadro
      timer = setTimeout(() => {
        setIsVisible(true)
      }, 20)
    } else {
      setIsVisible(false)
      // Esperar que termine la animación antes de desmontar
      timer = setTimeout(() => {
        setIsRendered(false)
      }, 280)
    }
    return () => clearTimeout(timer)
  }, [isOpen])

  // Manejo de la tecla Escape para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevenir scroll de fondo mientras el modal está activo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isRendered) return null

  // Determinar si es una solución estructurada o contenido legal
  const isSolution = content && typeof content === 'object' && !isValidElement(content) && content.question

  // URL dinámica de WhatsApp para soluciones
  const solutionWhatsappUrl = `https://wa.me/${contactoData.telefonoRaw}?text=${encodeURIComponent(
    `Hola JB Gestión, quisiera consultar sobre la solución: ${title}`
  )}`

  const renderContent = () => {
    if (!content) {
      return (
        <p className="text-slate-500 text-center py-6">Información en proceso...</p>
      )
    }

    // Si es un componente React directo (como TerminosYCondiciones o PoliticasYPrivacidad)
    if (isValidElement(content)) {
      return <div className="py-2">{content}</div>
    }

    // Si es texto HTML legado
    if (typeof content === 'string') {
      return (
        <div
          className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 [&_h3]:text-[#112842] [&_h3]:font-black [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:mt-5 [&_h3]:mb-1 [&_strong]:text-[#112842] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    // Si es un objeto de solución
    return (
      <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 py-2">
        {/* Pregunta / Diagnóstico Principal */}
        {content.question && (
          <div className="space-y-3 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80">
            <h3 className="text-lg sm:text-xl font-black text-[#112842] flex items-center gap-2.5">
              <span className="w-2 h-6 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
              <span>{content.question}</span>
            </h3>
            {content.description && (
              <p className="text-slate-600 leading-relaxed text-justify font-normal">
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Beneficios / Por qué es importante */}
        {content.importanceTitle && (
          <div className="space-y-3 bg-[#fdfbf5] p-5 sm:p-6 rounded-2xl border border-[#af7e35]/30 shadow-xs">
            <h4 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
              <i className="fas fa-check-circle text-[#af7e35]"></i>
              <span>{content.importanceTitle}</span>
            </h4>
            {content.importanceText && (
              <p className="text-slate-600 leading-relaxed font-normal">
                {content.importanceText}
              </p>
            )}
            {content.benefits && (
              <ul className="space-y-2.5 mt-2">
                {content.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-[#af7e35]/20 text-[#af7e35] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <i className="fas fa-check text-[10px]"></i>
                    </span>
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Ideal para */}
        {content.idealFor && (
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
              <i className="fas fa-users text-[#112842]"></i>
              <span>Ideal para:</span>
            </h4>
            <ul className="space-y-2">
              {content.idealFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#112842]/10 text-[#112842] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cita inspiracional / Consejo experto */}
        {content.quote && (
          <div className="bg-gradient-to-r from-[#fdfbf5] to-white border-l-4 border-[#af7e35] p-5 italic text-[#112842] font-semibold text-sm sm:text-base rounded-r-2xl shadow-xs">
            "{content.quote}"
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isVisible
        ? 'bg-[#051a32]/75 backdrop-blur-md opacity-100'
        : 'bg-[#051a32]/0 backdrop-blur-none opacity-0'
        }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-3xl ${isSolution ? 'max-w-xl' : 'max-w-3xl'
          } w-full max-h-[90vh] overflow-y-auto p-6 sm:p-9 relative shadow-2xl transition-all duration-300 transform border border-slate-100 flex flex-col ${isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar Superior (Fitts Law: 44x44px) */}
        <button
          type="button"
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#112842] border border-slate-200 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35] cursor-pointer active:scale-90"
          onClick={onClose}
          aria-label="Cerrar ventana emergente"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Cabecera con Micro-badge Editorial y Título */}
        <div className="text-left pr-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#112842]/5 rounded-md border-l-4 border-[#af7e35] text-[11px] font-black uppercase tracking-wider text-[#af7e35] mb-2">
            <span>{isSolution ? 'Diagnóstico & Solución Estratégica' : 'Marco Legal & Normativo'}</span>
          </div>

          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-black text-[#112842] tracking-tight leading-snug"
          >
            {title}
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-[#af7e35] to-[#8e6d23] rounded-full mt-3" />
        </div>

        {/* Cuerpo del Modal con Scroll Suave */}
        <div className="flex-grow pr-1 overflow-y-auto">{renderContent()}</div>

        {/* Pie de Acciones del Modal */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          {/* Botón directo a WhatsApp si es una solución */}
          {isSolution && (
            <a
              href={solutionWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#af7e35]/25 hover:shadow-xl active:scale-95 transition-all duration-300"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              <span>Consultar por esta Solución</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </a>
          )}

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#112842] font-bold text-sm tracking-wide transition-colors duration-200 cursor-pointer active:scale-95 text-center"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
