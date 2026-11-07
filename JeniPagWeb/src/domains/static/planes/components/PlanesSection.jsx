import { planesData } from '../data/planesData'
import { contactoData } from '../../../reusable/contacto/data/contactoData'

export function PlanesSection() {
  return (
    <section
      id="planes"
      className="w-full bg-gradient-to-br from-[#b0892c] via-[#af7e35] to-[#8e6d23] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Elementos ambientales de iluminación vanguardista */}
      <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-black/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge Superior Editorial con borde izquierdo resaltado */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border-l-4 border-amber-300 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4 shadow-lg">
          <i className="fas fa-crown text-xs text-amber-200"></i>
          <span>Tarifas & Cobertura a tu Medida</span>
        </div>

        {/* Título de Sección */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
          PLANES
        </h2>
        <p className="text-white/95 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto mb-16 sm:mb-20 leading-relaxed">
          Selecciona el plan ideal para estructurar, formalizar o expandir tu negocio con respaldo integral.
        </p>

        {/* Grid de 3 Planes con espacio superior para el badge sobresaliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 max-w-6xl mx-auto items-stretch pt-8 sm:pt-10">
          {planesData.map((plan) => {
            const planWhatsappUrl = `https://wa.me/${contactoData.telefonoRaw}?text=${encodeURIComponent(
              `Hola JB Gestión, quisiera más información sobre el ${plan.name}`
            )}`

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl flex flex-col justify-between transition-all duration-300 relative border ${
                  plan.recommended
                    ? 'border-2 border-[#af7e35] shadow-2xl shadow-[#112842]/30 lg:-translate-y-4 lg:scale-105 z-20 ring-4 ring-white/60 hover:-translate-y-6 hover:scale-[1.07] hover:shadow-2xl hover:shadow-[#112842]/40 cursor-pointer'
                    : 'border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2 z-10'
                }`}
              >
                {/* Badge Recomendado Estrella (Sin recorte por overflow, 100% visible) */}
                {plan.recommended && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#112842] via-[#07192d] to-[#112842] text-[#fdfbf5] px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl border-2 border-[#af7e35] flex items-center gap-2 z-30">
                    <i className="fas fa-star text-xs text-[#af7e35] animate-pulse"></i>
                    <span>{plan.badgeText}</span>
                  </div>
                )}

                {/* Encabezado del Plan y Características */}
                <div className="p-7 sm:p-9 text-left flex-grow flex flex-col">
                  {/* Icono y Nombre */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl p-1 bg-slate-50 overflow-hidden shrink-0 border border-slate-200/90 shadow-sm flex items-center justify-center">
                      <img
                        src={plan.headerIcon}
                        alt={plan.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#112842] leading-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-snug">
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Separador fino */}
                  <div className="w-full h-px bg-slate-100 my-4" />

                  {/* Lista de Características */}
                  <ul className="space-y-3.5 my-3 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs sm:text-sm text-slate-700 leading-snug"
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3 mt-0.5 font-bold ${
                            plan.recommended
                              ? 'bg-[#af7e35]/20 text-[#af7e35]'
                              : 'bg-[#112842]/10 text-[#112842]'
                          }`}
                        >
                          <i className="fas fa-check text-[10px]"></i>
                        </span>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pie de Tarjeta con Beneficio y Botón CTA */}
                <div
                  className={`p-6 sm:p-8 border-t border-slate-100 rounded-b-3xl ${
                    plan.recommended ? 'bg-[#fdfbf5]' : 'bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6 text-left">
                    <img
                      src={plan.footerIcon}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-xs"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#112842] leading-tight">
                      {plan.footerText}
                    </span>
                  </div>

                  <a
                    href={planWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2.5 w-full text-center py-4 px-5 rounded-2xl font-extrabold text-sm tracking-wide shadow-md hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-[#af7e35] via-[#bf8e3b] to-[#8e6d23] hover:from-[#8e6d23] hover:to-[#af7e35] text-white shadow-[#af7e35]/30 focus-visible:ring-[#af7e35]'
                        : 'bg-[#07192d] hover:bg-[#112842] text-white shadow-slate-900/10 focus-visible:ring-[#07192d]'
                    }`}
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>{plan.buttonText}</span>
                    <i className="fas fa-arrow-right text-xs"></i>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
