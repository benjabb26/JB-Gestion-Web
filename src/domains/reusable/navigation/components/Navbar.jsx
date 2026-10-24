import { useState, useEffect } from 'react'
import { navLinks } from '../data/navLinks'
import { contactoData } from '../../contacto/data/contactoData'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevenir scroll en body cuando el menú móvil esté abierto
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

  const whatsappUrl = `https://wa.me/${contactoData.telefonoRaw}?text=${encodeURIComponent(
    contactoData.mensajeWhatsAppDefault
  )}`

  return (
    <header
      id="cabezal"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-180 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-b border-black/[0.08] py-2 sm:py-2.5'
        : 'bg-white/75 backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.06] py-3.5 sm:py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo corporativo con micro-interacción */}
        <a
          href="#Panel"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35] rounded-xl"
          aria-label="Ir al inicio de JB Gestión & Capital Humano"
        >
          <img
            src="/logo_empresarial.png"
            alt="JB Gestión & Capital Humano"
            className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Navegación Desktop */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-sm lg:text-base font-bold text-[#112842] hover:text-[#af7e35] transition-colors duration-200 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#af7e35] after:to-[#8e6d23] hover:after:w-full after:transition-all after:duration-300 after:rounded-full"
            >
              {link.label}
            </a>
          ))}

          {/* Botones Redes Sociales Desktop (Facebook e Instagram) */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200/80">
            <a
              href={contactoData.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-[#af7e35] text-[#112842] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
              aria-label="Visitar Facebook de JB Gestión & Capital Humano"
            >
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
            <a
              href={contactoData.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-[#af7e35] text-[#112842] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
              aria-label="Visitar Instagram de JB Gestión & Capital Humano"
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
          </div>

          {/* Botón CTA Contactar con gradiente dorado */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#af7e35]/25 hover:shadow-xl hover:shadow-[#af7e35]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35] focus-visible:ring-offset-2"
          >
            <i className="fab fa-whatsapp text-base"></i>
            <span>Contactar</span>
          </a>
        </nav>

        {/* Zona Móvil: Redes + Botón Hamburguesa */}
        <div className="md:hidden flex items-center gap-2">
          {/* Botones Sociales compactos en cabecera móvil */}
          <a
            href={contactoData.redes.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-slate-100/90 text-[#112842] hover:bg-[#af7e35] hover:text-white flex items-center justify-center transition-colors shadow-xs"
            aria-label="Facebook de JB Gestión"
          >
            <i className="fab fa-facebook-f text-xs"></i>
          </a>
          <a
            href={contactoData.redes.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-slate-100/90 text-[#112842] hover:bg-[#af7e35] hover:text-white flex items-center justify-center transition-colors shadow-xs"
            aria-label="Instagram de JB Gestión"
          >
            <i className="fab fa-instagram text-xs"></i>
          </a>

          {/* Botón Hamburguesa Móvil (Fitts Law: área táctil 44x44px) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-[#112842] border border-slate-200/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
            aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay para móvil con desenfoque de cristal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#07192d]/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer / Desplegable móvil con micro-animaciones */}
      <div
        className={`fixed top-[65px] sm:top-[73px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-black/[0.08] shadow-2xl z-50 md:hidden transform transition-all duration-300 ease-in-out ${isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="max-w-md mx-auto px-5 py-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-[#112842] hover:text-[#af7e35] hover:bg-[#fdfbf5] active:bg-slate-100 transition-all duration-200"
            >
              <span>{link.label}</span>
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-[#af7e35]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}

          {/* Botones de Redes Sociales en Drawer Móvil */}
          <div className="pt-3 pb-1 flex items-center justify-center gap-3">
            <a
              href={contactoData.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-[#112842] hover:bg-[#af7e35] hover:text-white text-xs font-bold transition-colors shadow-xs"
            >
              <i className="fab fa-facebook-f text-xs"></i>
              <span>Facebook</span>
            </a>
            <a
              href={contactoData.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-[#112842] hover:bg-[#af7e35] hover:text-white text-xs font-bold transition-colors shadow-xs"
            >
              <i className="fab fa-instagram text-xs"></i>
              <span>Instagram</span>
            </a>
          </div>

          {/* CTA WhatsApp en móvil */}
          <div className="pt-3 border-t border-slate-100">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white font-extrabold text-base shadow-lg shadow-[#af7e35]/30 active:scale-98 transition-all duration-200"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
