import { valoresData } from '../data/valoresData'

export function NosotrosSection() {
  return (
    <section
      id="Nosotros"
      className="w-full bg-gradient-to-b from-white via-slate-50/80 to-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Luces decorativas ambientales estilo vanguardista */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#af7e35]/10 via-[#af7e35]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#112842]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabecera Principal - Estilo Bento Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-24">
          <div className="lg:col-span-5">
            {/* Badge Editorial con borde izquierdo */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#112842]/5 rounded-lg border-l-4 border-[#af7e35] shadow-xs mb-4">
              <i className="fas fa-landmark text-xs text-[#af7e35]"></i>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#112842]">
                Quiénes Somos
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#112842] tracking-tight leading-tight">
              Nosotros
            </h2>

            <div className="w-20 h-1.5 bg-gradient-to-r from-[#af7e35] to-[#8e6d23] rounded-full my-5" />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-900/5 relative">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                En <strong className="text-[#112842] font-bold">JB Gestión & Capital Humano E.I.R.L.</strong>, entendemos que el éxito de una organización no depende de un solo factor, sino de la armonía entre su capital humano, su salud financiera y su cultura corporativa. Diseñada para ofrecer soluciones 360° a personas naturales y jurídicas, tanto en el sector público como privado.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#af7e35]">
                <i className="fas fa-check-circle"></i>
                <span>Enfoque Estratégico & Humano</span>
              </div>
            </div>
          </div>
        </div>

        {/* Título de la Sección de Valores */}
        <div className="text-center mb-16">
          {/* Badge Editorial con borde izquierdo */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#112842]/5 rounded-lg border-l-4 border-[#af7e35] shadow-xs mb-3">
            <i className="fas fa-gem text-xs text-[#af7e35]"></i>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#112842]">
              Filosofía Corporativa
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#112842] uppercase tracking-tight">
            Nuestros Valores
          </h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mt-2 font-normal">
            Los pilares que fundamentan cada decisión y relación a largo plazo con nuestros clientes.
          </p>
        </div>

        {/* Grid Bento de 3 Valores con Números con margen interno armonioso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {valoresData.map((valor, idx) => {
            const numStr = `0${idx + 1}`
            return (
              <div
                key={valor.id}
                className="group relative bg-white rounded-3xl p-8 lg:p-9 flex flex-col justify-between border border-slate-200/80 shadow-md hover:shadow-2xl hover:shadow-[#af7e35]/15 hover:-translate-y-2 hover:border-[#af7e35]/50 transition-all duration-500 overflow-hidden"
              >
                {/* Número con amplio margen interno respecto a las esquinas */}
                <span className="absolute top-6 right-6 sm:top-8 sm:right-8 text-5xl sm:text-6xl font-black text-slate-200/80 group-hover:text-[#af7e35]/25 transition-colors duration-500 font-mono select-none pointer-events-none leading-none">
                  {numStr}
                </span>

                {/* Contenido superior de la tarjeta */}
                <div className="relative z-10">
                  {/* Contenedor de la foto con halo dorado suave */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#fdfbf5] to-white border border-[#af7e35]/30 shadow-sm group-hover:scale-105 group-hover:shadow-md group-hover:border-[#af7e35]/60 transition-all duration-300 flex items-center justify-center p-3.5 mb-6">
                    <img
                      src={valor.image}
                      alt={valor.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Título del Valor */}
                  <h4 className="text-base sm:text-lg font-black text-[#112842] group-hover:text-[#af7e35] uppercase tracking-wide leading-snug mb-3 transition-colors duration-300 pr-12">
                    {valor.title}
                  </h4>

                  {/* Descripción */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {valor.description}
                  </p>
                </div>

                {/* Barra de brillo inferior que se activa en hover */}
                <div className="w-full h-1 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-[#af7e35] group-hover:to-[#8e6d23] transition-all duration-500 rounded-full mt-8" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
