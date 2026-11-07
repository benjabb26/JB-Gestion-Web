import { serviciosData } from '../data/serviciosData'

export function ServiciosSection() {
  return (
    <section
      id="Servicios"
      className="w-full bg-gradient-to-b from-[#07192d] via-[#051a32] to-[#07192d] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white"
    >
      {/* Luces y texturas ambientales doradas difuminadas */}
      <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-[#af7e35]/20 via-[#af7e35]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-[550px] h-[550px] bg-gradient-to-tl from-[#af7e35]/15 via-[#b0892c]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge Superior Editorial con borde lateral izquierdo resaltado */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border-l-4 border-[#af7e35] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4 shadow-lg">
          <i className="fas fa-layer-group text-xs text-amber-300"></i>
          <span>Nuestros Servicios</span>
        </div>

        {/* Título y Subtítulo de Sección */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
          Soluciones integrales para tu empresa
        </h2>
        <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto mb-16 sm:mb-20 leading-relaxed">
          Acompañamos el crecimiento de tu negocio con servicios especializados y soluciones efectivas.
        </p>

        {/* Grid de 4 Tarjetas estilo Glass & Modern Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {serviciosData.map((servicio) => (
            <div
              key={servicio.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#af7e35]/20 hover:-translate-y-3 transition-all duration-300 flex flex-col justify-between border border-white/20 text-left relative"
            >
              {/* Parte Superior / Cuerpo de la Tarjeta */}
              <div className="p-6 sm:p-7 flex-grow flex flex-col">
                {/* Cabecera del Servicio con Icono Flotante */}
                <div className="text-center mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#fdfbf5] to-slate-50 border border-[#af7e35]/30 shadow-md flex items-center justify-center p-3.5 mx-auto mb-4 group-hover:scale-105 group-hover:border-[#af7e35]/60 transition-transform duration-300">
                    <img
                      src={servicio.icon}
                      alt={servicio.title.replace('\n', ' ')}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#112842] leading-snug whitespace-pre-line min-h-[3.25rem] flex items-center justify-center">
                    {servicio.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {servicio.description}
                  </p>
                </div>

                {/* Línea divisoria suave */}
                <div className="w-full h-px bg-slate-100 my-3" />

                {/* Lista de Viñetas con Checks Dorados */}
                <ul className="space-y-2.5 my-3 flex-grow">
                  {servicio.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-xs sm:text-sm text-slate-700 leading-snug"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0 mr-2.5 mt-0.5 font-bold">
                        <i className="fas fa-check text-[10px]"></i>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Badge Certificado (si aplica) */}
                {servicio.badge && (
                  <div className="mt-4 pt-2 self-center">
                    <div className="inline-flex items-center gap-2 bg-[#fdfbf5] border border-[#af7e35]/40 px-3.5 py-1.5 rounded-xl text-xs font-black text-[#112842] shadow-xs">
                      <i className="fas fa-graduation-cap text-[#af7e35] text-sm"></i>
                      <span>{servicio.badge}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pie de Tarjeta Institucional */}
              <div
                className={`p-4 sm:p-5 flex items-center justify-center gap-3 text-white text-center transition-all duration-300 ${
                  servicio.footerTheme === 'fondo_dorado'
                    ? 'bg-gradient-to-r from-[#af7e35] to-[#8e6d23] group-hover:from-[#8e6d23] group-hover:to-[#af7e35]'
                    : 'bg-gradient-to-r from-[#112842] to-[#07192d] group-hover:from-[#07192d] group-hover:to-[#112842]'
                }`}
              >
                <i className={`${servicio.footerIcon} text-lg shrink-0 opacity-90`}></i>
                <p className="text-xs sm:text-sm font-semibold leading-snug">
                  {servicio.footerText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
