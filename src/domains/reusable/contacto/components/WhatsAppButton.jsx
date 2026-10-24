import { contactoData } from '../data/contactoData'

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${contactoData.telefonoRaw}?text=${encodeURIComponent(
    contactoData.mensajeWhatsAppDefault
  )}`

  return (
    <aside id="WhatsApp" aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20ba59] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
        aria-label="Abrir chat de WhatsApp con JB Gestión & Capital Humano"
      >
        {/* Halo de pulso sutil para affordance visual */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Imagen del Logo de WhatsApp */}
        <div className="w-full h-full rounded-full overflow-hidden p-0.5 relative z-10 flex items-center justify-center">
          <img
            src="/images/whatsapp_image4.jpeg"
            alt="WhatsApp JB Gestión"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Tooltip moderno con flechita */}
        <span
          role="tooltip"
          className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-[#112842] text-white text-xs font-semibold py-2 px-3.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg hidden sm:flex items-center gap-2 border border-white/10"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>¿En qué podemos ayudarte?</span>
          {/* Flechita del Tooltip */}
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#112842]"
            aria-hidden="true"
          />
        </span>
      </a>
    </aside>
  )
}
