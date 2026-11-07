import { useState, useEffect, useRef } from 'react'
import { solucionesData } from '../data/solucionesData'

export function SolucionesSection({ onOpenModal }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4
      if (window.innerWidth >= 640) return 2
      return 1
    }
    return 4
  })

  // Detectar cambios en tamaño de pantalla para adaptar las tarjetas visibles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4)
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2)
      } else {
        setVisibleCards(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Índice máximo para no dejar espacios vacíos
  const maxIndex = Math.max(0, solucionesData.length - visibleCards)

  // Ajustar currentIndex si excede el maxIndex al cambiar resolución
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [maxIndex, currentIndex])

  // Navegar de uno en uno hacia la izquierda (retroceder)
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  // Navegar de uno en uno hacia la derecha (avanzar)
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  // Soporte para gestos táctiles (Swipe en móviles y tablets)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)
  const minSwipeDistance = 45

  const onTouchStart = (e) => {
    touchEndXRef.current = null
    touchStartXRef.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const distance = touchStartXRef.current - touchEndXRef.current
    if (distance > minSwipeDistance) {
      handleNext()
    } else if (distance < -minSwipeDistance) {
      handlePrev()
    }
  }

  return (
    <section
      id="Soluciones"
      className="w-full bg-gradient-to-b from-white via-slate-50/70 to-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Luz decorativa suave en fondo */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gradient-to-r from-[#af7e35]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-gradient-to-l from-[#112842]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabecera del Centro de Diagnóstico Empresarial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            {/* Badge Editorial con borde izquierdo */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#112842]/5 rounded-lg border-l-4 border-[#af7e35] shadow-xs mb-4">
              <i className="fas fa-stethoscope text-xs text-[#af7e35]"></i>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#112842]">
                Centro de Diagnóstico Empresarial
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#112842] tracking-tight leading-tight">
              Soluciones
            </h2>

            <div className="w-20 h-1.5 bg-gradient-to-r from-[#af7e35] to-[#8e6d23] rounded-full my-4" />

            <h4 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#07192d]">
              ¿Tu empresa tiene estos problemas?
            </h4>
            <p className="mt-3 text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
              Identifica el obstáculo actual de tu organización. Explora los casos con las flechas y haz clic en{' '}
              <span className="font-bold text-[#af7e35]">Ver más</span> para descubrir nuestra propuesta estratégica de solución inmediata.
            </p>
          </div>
        </div>

        {/* Carrusel de Casos con Flechas a los Costados */}
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Flecha Izquierda (Retroceder de uno en uno) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-2 sm:-left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md text-[#112842] hover:bg-[#af7e35] hover:text-white shadow-xl hover:shadow-2xl hover:shadow-[#af7e35]/30 border border-slate-200/90 hover:border-[#af7e35] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
            aria-label="Retroceder un caso"
            title="Retroceder 1 caso"
          >
            <i className="fas fa-chevron-left text-sm sm:text-lg"></i>
          </button>

          {/* Flecha Derecha (Avanzar de uno en uno) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-2 sm:-right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md text-[#112842] hover:bg-[#af7e35] hover:text-white shadow-xl hover:shadow-2xl hover:shadow-[#af7e35]/30 border border-slate-200/90 hover:border-[#af7e35] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
            aria-label="Avanzar un caso"
            title="Avanzar 1 caso"
          >
            <i className="fas fa-chevron-right text-sm sm:text-lg"></i>
          </button>

          {/* Viewport del Carrusel */}
          <div
            className="overflow-hidden py-6 -my-6 px-1 select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Pista deslizable con animación fluida */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {solucionesData.map((solucion, idx) => {
                const caseNum = `CASO 0${idx + 1}`

                return (
                  <div
                    key={solucion.id}
                    className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5 sm:px-3 box-border flex flex-col"
                  >
                    <div className="group bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between items-center text-center border border-slate-200/80 shadow-md hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2.5 hover:border-[#af7e35]/50 transition-all duration-300 min-h-[410px] w-full h-full relative overflow-hidden">
                      {/* Micro-badge de Diagnóstico / Caso con formato moderno editorial */}
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black tracking-wider text-[#112842] bg-slate-100/90 border-l-2 border-[#af7e35] px-2.5 py-1 rounded-sm uppercase">
                          {caseNum}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-[#af7e35] transition-colors" />
                      </div>

                      {/* Título de la Problemática */}
                      <div className="w-full mt-2">
                        <p className="text-base sm:text-lg font-black text-[#112842] leading-snug min-h-[3.25rem] flex items-center justify-center">
                          {solucion.title}
                        </p>
                        <div className="w-10 h-0.5 bg-slate-100 group-hover:w-20 group-hover:bg-gradient-to-r group-hover:from-[#af7e35] group-hover:to-[#8e6d23] mx-auto mt-2 transition-all duration-300 rounded-full" />
                      </div>

                      {/* Contenedor de la Imagen con Hover Zoom sutil */}
                      <div className="w-full my-5 py-4 px-3 rounded-2xl bg-gradient-to-b from-slate-50/90 to-white border border-slate-100 group-hover:border-[#af7e35]/25 flex items-center justify-center flex-grow transition-colors duration-300">
                        <img
                          src={solucion.image}
                          alt={solucion.title}
                          className="w-32 h-32 sm:w-36 sm:h-36 object-contain transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none"
                          loading="lazy"
                        />
                      </div>

                      {/* Botón Interactivo "Ver más" con Affordance de Flecha Animada */}
                      <button
                        type="button"
                        onClick={() => onOpenModal?.(solucion.title, solucion.modal)}
                        className="group/btn w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#af7e35] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#af7e35]/20 hover:shadow-lg hover:shadow-[#af7e35]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
                        aria-label={`Ver solución para: ${solucion.title}`}
                      >
                        <span>Ver más</span>
                        <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover/btn:translate-x-1.5"></i>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Indicadores de Paginación (Dots) Interactivos */}
          <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => {
              const isActive = currentIndex === dotIdx
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35] cursor-pointer ${isActive
                    ? 'w-8 h-2.5 bg-gradient-to-r from-[#af7e35] to-[#8e6d23] shadow-md shadow-[#af7e35]/30'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  aria-label={`Ir al grupo de casos ${dotIdx + 1}`}
                  title={`Caso ${dotIdx + 1}`}
                />
              )
            })}
          </div>

          {/* Texto de ayuda en móviles */}
          <div className="sm:hidden text-center mt-3">
            <span className="text-xs text-slate-400 font-medium">
              Caso {currentIndex + 1} de {solucionesData.length} &bull; Desliza o toca las flechas
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
