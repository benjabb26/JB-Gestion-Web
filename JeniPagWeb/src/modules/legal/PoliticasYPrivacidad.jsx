export function PoliticasYPrivacidad() {
  return (
    <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
      {/* Declaración de Cumplimiento Normativo */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#fdfbf5] border border-[#af7e35]/30">
        <p className="font-semibold text-[#112842]">
          En <strong>JB Gestión & Capital Humano E.I.R.L.</strong> reconocemos la importancia de la privacidad y confidencialidad de la información. Por ello, tratamos los datos personales de nuestros usuarios y clientes con total apego a la <strong>Ley N.º 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su Reglamento aprobado mediante <strong>Decreto Supremo N.º 003-2013-JUS</strong>.
        </p>
      </div>

      {/* Sección 1 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>1. Responsable del Tratamiento de los Datos Personales</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          El titular y responsable de los bancos de datos personales derivados de las interacciones en este sitio web y sus canales asociados es:
        </p>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm space-y-1 text-slate-700">
          <p><strong>Razón Social:</strong> JB Gestión & Capital Humano E.I.R.L.</p>
          <p><strong>Domicilio:</strong> Lima, República del Perú</p>
          <p><strong>Correo electrónico de privacidad:</strong> <a href="mailto:administracion@jbgestion.pe" className="text-[#af7e35] font-semibold underline">administracion@jbgestion.pe</a></p>
          <p><strong>Línea de atención oficial:</strong> +51 920 862 919</p>
        </div>
      </div>

      {/* Sección 2 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>2. Datos Personales Recopilados</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          La Empresa recopila únicamente aquellos datos personales estrictamente necesarios y proporcionales para atender las consultas y prestar los servicios solicitados por el Usuario, tales como:
        </p>
        <ul className="space-y-2 pl-2">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✔</span>
            <span>Datos de identificación y contacto: Nombres y apellidos completos, número de teléfono fijo o móvil, número de WhatsApp y dirección de correo electrónico.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✔</span>
            <span>Datos corporativos: Razón social o nombre comercial de la empresa representada, número de RUC y cargo dentro de la organización.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✔</span>
            <span>Datos de consulta técnica: Detalles específicos referidos a la problemática laboral, contable, tributaria o de capacitación requerida.</span>
          </li>
        </ul>
      </div>

      {/* Sección 3 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>3. Finalidades del Tratamiento</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          Los datos personales recolectados serán utilizados para las siguientes finalidades explícitas y lícitas:
        </p>
        <ul className="space-y-1.5 pl-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-[#af7e35] font-bold">a)</span>
            <span>Absolver consultas, atender solicitudes de cotización y formular propuestas técnicas y económicas a medida.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#af7e35] font-bold">b)</span>
            <span>Gestionar la ejecución, prestación y facturación de los servicios profesionales contratados.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#af7e35] font-bold">c)</span>
            <span>Administrar la inscripción a cursos, talleres formativos y expedir los respectivos certificados de participación.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#af7e35] font-bold">d)</span>
            <span>Remitir comunicaciones informativas sobre cambios normativos laborales o tributarios en el Perú, pudiendo el usuario darse de baja en cualquier momento.</span>
          </li>
        </ul>
      </div>

      {/* Sección 4 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>4. Consentimiento del Usuario</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          El Usuario otorga su consentimiento previo, libre, expreso, informado e inequívoco para el tratamiento de sus datos personales conforme a los fines aquí descritos al momento de comunicarse mediante los botones de enlace a WhatsApp, formulario o remitir correos a la Empresa. El Usuario garantiza la veracidad y exactitud de la información facilitada.
        </p>
      </div>

      {/* Sección 5 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>5. Plazo de Conservación de los Datos</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          Los datos personales serán conservados durante el plazo necesario para el cumplimiento de las finalidades autorizadas por el titular, mientras dure la relación comercial contractual, o durante los plazos legalmente exigibles por las normas tributarias y contables vigentes en el Perú (SUNAT / Código Tributario).
        </p>
      </div>

      {/* Sección 6 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>6. Transferencia y Compartición con Terceros</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          JB Gestión & Capital Humano E.I.R.L. no vende, alquila, comercializa ni transfiere los datos personales de sus usuarios a terceros para fines de publicidad o lucro ajeno. Solo se efectuarán transferencias cuando sean estrictamente requeridas por mandato judicial o requerimiento expreso de autoridades competentes en el marco de la legislación peruana.
        </p>
      </div>

      {/* Sección 7 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>7. Medidas de Seguridad de la Información</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          La Empresa adopta las medidas técnicas, organizativas y legales requeridas por la Ley N.º 29733 y su Directiva de Seguridad para evitar la pérdida, mal uso, alteración, acceso no autorizado o sustracción de los datos personales.
        </p>
      </div>

      {/* Sección 8 */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-[#112842] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block shrink-0"></span>
          <span>8. Ejercicio de los Derechos ARCO</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          Conforme a la Ley N.º 29733, los titulares de datos personales tienen derecho a ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, así como revocar su consentimiento en cualquier momento y de forma gratuita.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="font-semibold text-[#112842] mb-1">Procedimiento de solicitud:</p>
          <p className="text-xs sm:text-sm text-slate-600">
            Remitir un correo electrónico a <a href="mailto:administracion@jbgestion.pe" className="text-[#af7e35] font-bold underline">administracion@jbgestion.pe</a> con el asunto: <em>"Derechos ARCO - Datos Personales"</em>, adjuntando copia simple de su Documento Nacional de Identidad (DNI) o documento equivalente y detallando claramente la solicitud a ejercer. Su requerimiento será atendido en los plazos legales establecidos.
          </p>
        </div>
      </div>
    </div>
  )
}
