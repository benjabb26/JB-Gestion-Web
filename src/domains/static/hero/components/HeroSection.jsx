import { useState, useEffect, useRef } from 'react'
import { contactoData } from '../../../reusable/contacto/data/contactoData'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const currentSection = sectionRef.current
    if (!currentSection) return

    let timer = null

    // Usar IntersectionObserver para activar la animación al entrar a la sección
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Breve retardo para que el navegador registre el estado inicial y anime con suavidad
          timer = setTimeout(() => {
            setIsVisible(true)
          }, 80)
        } else {
          // Reinicia al salir para que vuelva a animarse si se regresa a la sección
          setIsVisible(false)
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(currentSection)

    return () => {
      if (timer) clearTimeout(timer)
      if (currentSection) observer.unobserve(currentSection)
    }
  }, [])

  const whatsappUrl = `https://wa.me/${contactoData.telefonoRaw}?text=${encodeURIComponent(
    contactoData.mensajeWhatsAppDefault
  )}`

  return (
    <section
      ref={sectionRef}
      id="Panel"
      className="relative w-full min-h-[660px] lg:min-h-[760px] pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 flex items-center bg-cover bg-no-repeat bg-center lg:bg-right overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 40%, rgba(255, 255, 255, 0.78) 60%, rgba(255, 255, 255, 0.2) 85%, rgba(255, 255, 255, 0.05) 100%), url('/img_panel/hero_imagen.jpeg')`,
      }}
    >
      {/* Halos de luz ambiental difuminada estilo consultoría de élite */}
      <div className="absolute -top-32 left-10 w-[500px] h-[500px] bg-gradient-to-br from-[#af7e35]/15 via-[#af7e35]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-gradient-to-tr from-[#112842]/10 via-[#af7e35]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-xl lg:max-w-2xl text-left">
          {/* Badge superior editorial moderno con borde izquierdo resaltado */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-2 bg-[#112842]/5 backdrop-blur-sm rounded-lg border-l-4 border-[#af7e35] shadow-xs mb-6 border border-slate-200/50 transition-all duration-700 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12 pointer-events-none'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
          >
            <i className="fas fa-shield-alt text-xs text-[#af7e35]"></i>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#112842]">
              Soluciones Estratégicas 360° en el Perú
            </span>
          </div>

          {/* Titular Imponente con degradado dorado de alta gama */}
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-extrabold uppercase tracking-tight text-[#112842] leading-[1.14] transition-all duration-800 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16 pointer-events-none'
            }`}
            style={{ transitionDelay: isVisible ? '250ms' : '0ms' }}
          >
            Lleva tu empresa al siguiente nivel con una gestión{' '}
            <span className="bg-gradient-to-r from-[#af7e35] via-[#c99542] to-[#8e6d23] bg-clip-text text-transparent drop-shadow-xs font-black inline-block">
              eficiente, estratégica y profesional
            </span>
            .
          </h1>

          {/* Bajada con tipografía refinada y espaciada */}
          <p
            className={`mt-6 text-base sm:text-lg lg:text-xl text-[#07192d]/90 font-medium leading-relaxed max-w-xl transition-all duration-800 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-14 pointer-events-none'
            }`}
            style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
          >
            En <strong className="text-[#112842] font-bold">JB Gestión & Capital Humano</strong> te ayudamos a ordenar, optimizar y hacer crecer tu negocio con soluciones integrales en RRHH, Contabilidad y más.
          </p>

          {/* Botones CTA de alto impacto */}
          <div
            className={`mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-800 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12 pointer-events-none'
            }`}
            style={{ transitionDelay: isVisible ? '550ms' : '0ms' }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white text-base sm:text-lg font-extrabold shadow-xl shadow-[#af7e35]/30 hover:shadow-2xl hover:shadow-[#af7e35]/45 hover:-translate-y-1 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35] focus-visible:ring-offset-2"
            >
              <i className="fab fa-whatsapp text-2xl transition-transform duration-300 group-hover:scale-110"></i>
              <span>Asesoría Inmediata</span>
              <i className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>

            <a
              href="#Servicios"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-md text-[#112842] border-2 border-[#112842]/80 hover:bg-[#112842] hover:text-white text-base sm:text-lg font-bold shadow-md shadow-slate-900/5 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#112842]"
            >
              Ver Servicios
            </a>
          </div>

          {/* Barra de métricas / confianza de alto impacto (Bento Trust Bar) */}
          <div
            className={`mt-12 backdrop-blur-xl bg-white/85 rounded-2xl border border-slate-200/90 p-5 shadow-xl shadow-slate-900/5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 transition-all duration-800 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10 pointer-events-none'
            }`}
            style={{ transitionDelay: isVisible ? '700ms' : '0ms' }}
          >
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#af7e35]/20 to-[#af7e35]/5 border border-[#af7e35]/30 flex items-center justify-center text-[#af7e35] shrink-0 font-black text-sm">
                100%
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#112842] leading-tight">
                  Cumplimiento Total
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Planillas & Legislación</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#112842]/15 to-[#112842]/5 border border-[#112842]/20 flex items-center justify-center text-[#112842] shrink-0 font-black text-sm">
                360°
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#112842] leading-tight">
                  Soluciones Integrales
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">RRHH, Finanzas & Eventos</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center text-emerald-700 shrink-0 font-black text-sm">
                <i className="fas fa-shield-alt text-base"></i>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#112842] leading-tight">
                  Cero Contingencias
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">SUNAT & SUNAFIL al día</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
