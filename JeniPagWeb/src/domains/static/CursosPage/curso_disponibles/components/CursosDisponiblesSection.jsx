import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCursosDisponibles } from '../hooks/useCursosDisponibles';

/**
 * Componente interactivo que presenta el catálogo de cursos disponibles
 * mediante un carrusel dinámico a pantalla completa sin imágenes, destacando
 * información curricular, inversión, descarga de temario y acceso a inscripción.
 * Totalmente optimizado para dispositivos móviles y pantallas táctiles.
 */
export function CursosDisponiblesSection() {
  const {
    cursoActivo,
    totalCursos,
    loading,
    error,
    currentIndex,
    nextCourse,
    prevCourse,
    goToCourse,
  } = useCursosDisponibles();

  const [showNoTemarioModal, setShowNoTemarioModal] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Manejador de transición suave al cambiar de curso
  const handleNav = (navAction) => {
    setAnimating(true);
    navAction();
    setTimeout(() => setAnimating(false), 300);
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowNoTemarioModal(false);
    };
    if (showNoTemarioModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNoTemarioModal]);

  return (
    <section
      id="CursosDisponibles"
      className="w-full bg-gradient-to-b from-white via-slate-50/70 to-white py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Halos decorativos de fondo acordes a la identidad visual */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-[#af7e35]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gradient-to-tl from-[#112842]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] w-full mx-auto relative z-10">
        {/* ===================================================================
         * ENCABEZADO Y TEXTO DE ENGANCHE
         * =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          {/* Badge institucional con borde izquierdo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#112842]/5 rounded-lg border-l-4 border-[#af7e35] shadow-xs mb-3 sm:mb-4">
            <i className="fas fa-graduation-cap text-xs text-[#af7e35]" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#112842]">
              Cursos Disponibles
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#112842] tracking-tight leading-tight uppercase break-words px-2 sm:px-0">
            Programas de Especialización y Actualización Laboral
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed font-normal px-2 sm:px-0">
            Potencia tu perfil con capacitaciones diseñadas para la realidad empresarial del Perú.
            Metodología 100% práctica con análisis de casos reales, simulación en plataformas oficiales
            (AFPnet, T-Registro, PLAME), entrega de plantillas automatizadas en Excel y constancia
            de participación con valor curricular respaldada por <strong className="text-[#112842] font-semibold">JB Gestión &amp; Capital Humano</strong>.
          </p>
        </div>

        {/* ===================================================================
         * ESTADO DE CARGA (SKELETON)
         * =================================================================== */}
        {loading && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-12 shadow-xl animate-pulse max-w-4xl lg:max-w-5xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-2">
                <div className="w-24 h-6 bg-slate-200 rounded-full" />
                <div className="w-28 h-6 bg-slate-200 rounded-full" />
              </div>
              <div className="w-48 h-6 bg-slate-100 rounded-full" />
            </div>
            <div className="w-3/4 h-10 bg-slate-200 rounded-xl" />
            <div className="w-full h-24 bg-slate-100 rounded-2xl" />
            <div className="w-full h-16 bg-slate-100 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="h-14 bg-slate-100 rounded-xl" />
              <div className="h-14 bg-slate-100 rounded-xl" />
              <div className="h-14 bg-slate-100 rounded-xl" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="h-14 flex-1 bg-slate-200 rounded-2xl" />
              <div className="h-14 flex-1 bg-slate-100 rounded-2xl" />
            </div>
          </div>
        )}

        {/* ===================================================================
         * CONTENEDOR DEL CARRUSEL DE CURSO ACTIVO (Ancho Completo sin imagen)
         * =================================================================== */}
        {!loading && cursoActivo && (
          <div className="relative max-w-4xl lg:max-w-5xl mx-auto">
            {/* Flecha de Navegación Izquierda (Desktop / Tablet) */}
            {totalCursos > 1 && (
              <button
                type="button"
                onClick={() => handleNav(prevCourse)}
                aria-label="Ver curso anterior"
                className="hidden md:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border border-slate-200 text-[#112842] hover:bg-[#112842] hover:text-amber-300 hover:border-[#112842] shadow-xl hover:shadow-2xl transition-all duration-300 items-center justify-center text-base lg:text-lg cursor-pointer active:scale-95 group"
              >
                <i className="fas fa-chevron-left transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Flecha de Navegación Derecha (Desktop / Tablet) */}
            {totalCursos > 1 && (
              <button
                type="button"
                onClick={() => handleNav(nextCourse)}
                aria-label="Ver curso siguiente"
                className="hidden md:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border border-slate-200 text-[#112842] hover:bg-[#112842] hover:text-amber-300 hover:border-[#112842] shadow-xl hover:shadow-2xl transition-all duration-300 items-center justify-center text-base lg:text-lg cursor-pointer active:scale-95 group"
              >
                <i className="fas fa-chevron-right transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Tarjeta Principal del Curso Activo */}
            <div
              className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl sm:shadow-2xl p-5 sm:p-8 lg:p-12 overflow-hidden relative transition-opacity duration-300 ${
                animating ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
            >
              {/* Resplandores decorativos de esquina */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#af7e35]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#112842]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5 sm:space-y-7">
                {/* Fila Superior de Badges, Metadatos y Respaldo Oficial */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#112842] text-amber-300 text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                      {cursoActivo.codigo_curso}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {cursoActivo.modalidad || '100% Virtual en Vivo'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-semibold">
                      <i className="fas fa-clock text-[10px] text-[#af7e35]" />
                      {cursoActivo.duracion}
                    </span>
                  </div>

                  {/* Badge de Respaldo Oficial Integrado */}
                  <div className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs font-bold text-slate-700">
                    <i className="fas fa-shield-alt text-[#af7e35]" />
                    <span>Respaldo Oficial · JB Gestión &amp; Capital Humano</span>
                  </div>
                </div>

                {/* Nombre del Curso */}
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#112842] leading-snug tracking-tight break-words">
                  {cursoActivo.nombre_curso}
                </h3>

                {/* Bloque de Inversión / Precio */}
                <div className="bg-gradient-to-r from-slate-50 via-[#fdfbf5] to-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Inversión Promocional Oficial
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-4xl font-black text-[#112842] tracking-tight">
                        {cursoActivo.precio_formateado || `S/ ${cursoActivo.precio}.00`}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-500">PEN · Pago único</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700">
                      <i className="fas fa-check-circle text-emerald-600" />
                      Vacantes Limitadas
                    </span>
                    <span className="block text-xs text-slate-500">
                      Acceso a sesiones en vivo + grabaciones
                    </span>
                  </div>
                </div>

                {/* Descripción del Curso */}
                <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
                  {cursoActivo.descripcion}
                </p>

                {/* Badges de Beneficios Clave (Grid de 3 columnas balanceado) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 hover:border-[#af7e35]/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0">
                      <i className="fas fa-certificate text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Certificado</span>
                      <span className="text-xs sm:text-sm font-bold text-[#112842] block leading-tight">Digital Oficial con QR</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 hover:border-[#af7e35]/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0">
                      <i className="fas fa-file-excel text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Material de Trabajo</span>
                      <span className="text-xs sm:text-sm font-bold text-[#112842] block leading-tight">Plantillas Excel en Vivo</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 hover:border-[#af7e35]/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0">
                      <i className="fas fa-video text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Aula Virtual</span>
                      <span className="text-xs sm:text-sm font-bold text-[#112842] block leading-tight">Grabaciones por 30 días</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción (Inscribirme y Temario) */}
                <div className="pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Botón Principal: Inscribirme Ahora */}
                  <Link
                    to="/inscripcion"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white font-black text-sm sm:text-base tracking-wide shadow-xl shadow-[#af7e35]/30 hover:shadow-2xl hover:shadow-[#af7e35]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-center cursor-pointer"
                  >
                    <span>Inscribirme Ahora</span>
                    <i className="fas fa-arrow-right text-xs" />
                  </Link>

                  {/* Botón Secundario: Descargar Temario */}
                  {cursoActivo.temario?.tieneTemario ? (
                    <a
                      href={cursoActivo.temario.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-[#112842] text-[#112842] hover:bg-[#112842] hover:text-white font-black text-sm sm:text-base transition-all duration-300 shadow-sm active:scale-95 cursor-pointer group text-center"
                    >
                      <i className="fas fa-file-pdf text-red-500 group-hover:text-amber-300 text-base transition-colors" />
                      <span>Descargar Temario Oficial</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowNoTemarioModal(true)}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-300 hover:border-[#112842] text-slate-700 hover:text-[#112842] font-black text-sm sm:text-base transition-all duration-300 shadow-sm active:scale-95 cursor-pointer group text-center"
                    >
                      <i className="fas fa-file-lines text-slate-400 group-hover:text-[#af7e35] text-base transition-colors" />
                      <span>Descargar Temario</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ===============================================================
             * CONTROLES DE PAGINACIÓN / DOTS Y NAVEGACIÓN MÓVIL
             * =============================================================== */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              {/* Botones de navegación móviles */}
              <div className="flex md:hidden items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => handleNav(prevCourse)}
                  aria-label="Curso anterior"
                  className="flex-1 max-w-[140px] py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-[#112842] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <i className="fas fa-chevron-left text-[10px]" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNav(nextCourse)}
                  aria-label="Curso siguiente"
                  className="flex-1 max-w-[140px] py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-[#112842] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Siguiente</span>
                  <i className="fas fa-chevron-right text-[10px]" />
                </button>
              </div>

              {/* Indicadores Circulares / Píldoras (Dots) */}
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: totalCursos }).map((_, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNav(() => goToCourse(idx))}
                      aria-label={`Ir al curso ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'w-8 bg-[#af7e35] shadow-sm shadow-[#af7e35]/40'
                          : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Contador de posición */}
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Curso <strong className="text-[#112842]">{currentIndex + 1}</strong> de{' '}
                <strong className="text-[#112842]">{totalCursos}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
       * MODAL / ALERTA ELEGANTE: TEMARIO NO DISPONIBLE
       * ===================================================================== */}
      {showNoTemarioModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowNoTemarioModal(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Círculo decorativo de fondo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl shadow-sm">
              <i className="fas fa-clock" />
            </div>

            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#af7e35] block mb-1">
              Actualización Académica
            </span>

            <h4 className="text-lg sm:text-2xl font-black text-[#112842] leading-snug break-words">
              Temario Próximamente Disponible
            </h4>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              El temario detallado de <strong className="text-[#112842]">«{cursoActivo?.nombre_curso}»</strong> está en proceso de revisión curricular y será publicado en breve.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              ¿Deseas conocer los módulos o asegurar tu vacante antes del inicio? Nuestro equipo académico puede asistirte inmediatamente.
            </p>

            {/* Acciones del Modal */}
            <div className="mt-6 space-y-2.5">
              <a
                href={`https://wa.me/51920862919?text=${encodeURIComponent(
                  `Hola equipo de JB Gestión, deseo consultar el temario e información del curso: ${cursoActivo?.nombre_curso}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <i className="fab fa-whatsapp text-lg" />
                <span>Consultar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowNoTemarioModal(false)}
                className="w-full px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CursosDisponiblesSection;
