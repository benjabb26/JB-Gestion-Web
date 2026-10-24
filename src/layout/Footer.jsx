import { contactoData } from '../domains/reusable/contacto/data/contactoData'

export function Footer({ onOpenLegal }) {
  return (
    <footer className="w-full bg-[#051a32] text-slate-300 pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 font-sans relative overflow-hidden">
      {/* Sutil resplandor ambiental en el footer */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-[#af7e35]/10 via-[#af7e35]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-[#112842]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Línea divisoria superior con brillo dorado central */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#af7e35]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Contenido en 3 Columnas Armónicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          {/* Columna 1: Marca y Redes Sociales */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tight">
              JB<span className="bg-gradient-to-r from-[#af7e35] to-[#c99542] bg-clip-text text-transparent"> Gestión y Capital Humano</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              Soluciones integrales 360° en Recursos Humanos, servicios contables, tributarios, capacitaciones y eventos corporativos en el Perú.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={contactoData.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#af7e35] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#af7e35]/30 border border-white/10 hover:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
                aria-label="Seguir a JB Gestión en Facebook"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a
                href={contactoData.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#af7e35] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#af7e35]/30 border border-white/10 hover:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
                aria-label="Seguir a JB Gestión en Instagram"
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a
                href={contactoData.redes.tiktok}
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#af7e35] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#af7e35]/30 border border-white/10 hover:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af7e35]"
                aria-label="Seguir a JB Gestión en TikTok"
              >
                <i className="fab fa-tiktok text-sm"></i>
              </a>
            </div>
          </div>

          {/* Columna 2: Información Legal */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2.5">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#af7e35] to-[#8e6d23] rounded-full inline-block"></span>
              <span>Información Legal</span>
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="#terminos"
                  onClick={(e) => {
                    e.preventDefault()
                    onOpenLegal?.('terminos')
                  }}
                  className="text-slate-400 hover:text-[#af7e35] transition-colors duration-200 flex items-center gap-2.5 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#af7e35] rounded"
                >
                  <i className="fas fa-file-contract text-xs text-[#af7e35]"></i>
                  <span>Términos y condiciones</span>
                </a>
              </li>
              <li>
                <a
                  href="#privacidad"
                  onClick={(e) => {
                    e.preventDefault()
                    onOpenLegal?.('privacidad')
                  }}
                  className="text-slate-400 hover:text-[#af7e35] transition-colors duration-200 flex items-center gap-2.5 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#af7e35] rounded"
                >
                  <i className="fas fa-shield-alt text-xs text-[#af7e35]"></i>
                  <span>Política y Privacidad</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto Directo */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2.5">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#af7e35] to-[#8e6d23] rounded-full inline-block"></span>
              <span>Contacto</span>
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#af7e35] flex items-center justify-center shrink-0">
                  <i className="fas fa-phone-alt text-xs"></i>
                </span>
                <a
                  href={`tel:${contactoData.telefonoRaw}`}
                  className="hover:text-white transition-colors duration-200 font-medium"
                >
                  {contactoData.telefono}
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#af7e35] flex items-center justify-center shrink-0">
                  <i className="fas fa-envelope text-xs"></i>
                </span>
                <a
                  href={`mailto:${contactoData.email}`}
                  className="hover:text-white transition-colors duration-200 font-medium"
                >
                  {contactoData.email}
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#af7e35] flex items-center justify-center shrink-0">
                  <i className="fas fa-map-marker-alt text-xs"></i>
                </span>
                <span className="font-medium">{contactoData.ubicacion}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="pt-8 text-center text-xs text-slate-500 font-normal">
          <p>&copy; 2026 JB Gestión & Capital Humano E.I.R.L. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
