import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormInscripcion } from '../hooks/useFormInscripcion';
import BotonMercadoPago from '../../../Checkout/components/BotonMercadoPago';
import {
  SITUACION_OCUPACIONAL_OPTIONS,
  NIVEL_CONOCIMIENTO_OPTIONS,
  COMO_CONOCISTE_OPTIONS,
  DEPARTAMENTOS_PERU,
} from '../data/cursoInscripcionData';

/* ============================================================================
 * COMPONENTES AUXILIARES REDISEÑADOS
 * ============================================================================ */

/** Campo de formulario con etiqueta y mensaje de error - REDISEÑADO */
function FormField({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-semibold text-[#112842]">
          {label}
          {required && <span className="text-[#af7e35] text-base leading-none">*</span>}
        </label>
      )}
      {hint && <p className="text-xs text-[#666666] -mt-1">{hint}</p>}
      {children}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1.5 font-medium animate-pulse">
          <i className="fas fa-circle-exclamation text-[10px]" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/** Clases de input/select - REDISEÑADO */
function inputClass(hasError) {
  return `w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium text-[#112842] bg-white placeholder:text-slate-300 placeholder:font-normal focus:outline-none transition-all duration-200 ${
    hasError
      ? 'border-red-400 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100'
      : 'border-slate-200 hover:border-[#af7e35]/40 focus:border-[#af7e35] focus:ring-4 focus:ring-[#af7e35]/10'
  }`;
}

/** Encabezado de sección numerada - REDISEÑADO */
function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#112842] to-[#07192d] text-[#af7e35] font-black text-sm flex items-center justify-center shadow-md shadow-[#112842]/20">
          {number}
        </div>
        <div className="w-px h-4 bg-gradient-to-b from-[#af7e35]/40 to-transparent" />
      </div>
      <div className="pt-1.5">
        <h2 className="text-base font-black text-[#112842] tracking-tight uppercase">{title}</h2>
        {subtitle && <p className="text-xs text-[#666666] mt-0.5 font-normal leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ============================================================================
 * COMPONENTE PRINCIPAL REDISEÑADO
 * ============================================================================ */
export function FormInscripcion({ onOpenPrivacyPolicy }) {
  const {
    formData,
    handleChange,
    cursos,
    horariosDisponibles,
    seleccionarCurso,
    cursoExpandido,
    toggleCurso,
    horariosPorCurso,
    seleccionarHorario,
    deseleccionarCurso,
    enviarFormulario,
    confirmarPagoExitoso,
    fase,
    resetForm,
    estadosDeCarga,
    mensajeVacioCursos,
    mensajeVacioHorarios,
    datosRegistrados,
    isSubmitted,
    isSubmitting,
  } = useFormInscripcion();

  const [errors, setErrors] = useState({});
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(String(text));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleReset = () => {
    setErrors({});
    resetForm();
  };

  /* ---- Validación básica antes de enviar ---- */
  const validar = () => {
    const newErrors = {};
    if (!formData.nombre_completo.trim()) newErrors.nombre_completo = 'El nombre completo es obligatorio.';
    if (!formData.celular.trim()) newErrors.celular = 'El celular es obligatorio.';
    if (!formData.correo.trim()) newErrors.correo = 'El correo electrónico es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim()))
      newErrors.correo = 'Ingresa un correo electrónico válido.';
    if (!formData.situacion_ocupacional) newErrors.situacion_ocupacional = 'Selecciona tu situación ocupacional.';

    // Validaciones dinámicas según la situación ocupacional
    if (formData.situacion_ocupacional === 'Estudiante o egresado') {
      if (!formData.centro_estudios || !formData.centro_estudios.trim()) {
        newErrors.centro_estudios = 'Ingresa tu centro de estudios (universidad o instituto).';
      }
    } else if (formData.situacion_ocupacional === 'Trabajador dependiente (Planilla)') {
      if (!formData.empresa_emprendimiento || !formData.empresa_emprendimiento.trim()) {
        newErrors.empresa_emprendimiento = 'Ingresa el nombre de la empresa donde laboras.';
      }
    } else if (formData.situacion_ocupacional === 'Empresario / Dueño de negocio / MYPE') {
      if (!formData.empresa_emprendimiento || !formData.empresa_emprendimiento.trim()) {
        newErrors.empresa_emprendimiento = 'Ingresa el nombre de tu empresa o emprendimiento.';
      }
      if (!formData.numero_trabajadores) {
        newErrors.numero_trabajadores = 'Selecciona el rango de número de trabajadores.';
      }
    }

    // Obligatorio para todas las situaciones ocupacionales
    if (!formData.area_interes || !formData.area_interes.trim()) {
      newErrors.area_interes = 'El área de interés o especialidad es obligatoria.';
    }

    if (!formData.cursos_seleccionados || formData.cursos_seleccionados.length === 0) {
      newErrors.cursos_seleccionados = 'Debes seleccionar al menos un curso con horario.';
    }
    if (!formData.nivel_conocimiento) newErrors.nivel_conocimiento = 'Selecciona tu nivel de conocimiento.';
    if (!formData.origen_contacto) newErrors.origen_contacto = '¿Cómo conociste la capacitación?';
    if (!formData.acepta_privacidad) newErrors.acepta_privacidad = 'Debes aceptar la política de privacidad.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    // Ejecutar envío y verificar respuesta de negocio estrictamente
    const res = await enviarFormulario();
    if (!res || res.success !== true) {
      // Retorno temprano: Detener cualquier avance si la BD devolvió success: false
      return;
    }
  };

  const handleSituacionOcupacionalChange = (e) => {
    handleChange(e);
    // Limpiar errores residuales de campos condicionales y de situación ocupacional
    setErrors((prev) => {
      const {
        situacion_ocupacional: _sit,
        centro_estudios: _ce,
        empresa_emprendimiento: _ee,
        numero_trabajadores: _nt,
        ...rest
      } = prev;
      return rest;
    });
  };

  /* ============================================================================
   * PANTALLA DE CARGA INICIAL DE CURSOS
   * ============================================================================ */
  if (estadosDeCarga.cargandoCursos) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center py-24 gap-4 bg-gradient-to-br from-[#f3eeeef5] via-white to-[#f3eeeef5]">
        <div className="w-14 h-14 rounded-full border-4 border-[#af7e35] border-t-transparent animate-spin shadow-lg shadow-[#af7e35]/20" />
        <p className="text-sm text-[#112842] font-semibold tracking-wide">Cargando cursos disponibles…</p>
      </div>
    );
  }

  /* ============================================================================
   * PANTALLA DE CHECKOUT (PASO 2: PAGO SEGURO) - REDISEÑADA
   * ============================================================================ */
  if (fase === 'checkout' && datosRegistrados) {
    const firstName = datosRegistrados.nombre_completo?.split(' ')[0] || 'Participante';
    const codigo = `JBI-${datosRegistrados.id_preinscripcion}`;

    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#f3eeeef5] via-white to-[#f3eeeef5] py-8 lg:py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-[#e0ceb1]/50 shadow-2xl shadow-[#112842]/10 overflow-hidden">
            {/* Header del Checkout con gradiente navy */}
            <div className="bg-gradient-to-br from-[#07192d] via-[#112842] to-[#07192d] text-white p-7 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#af7e35]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#af7e35]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 max-w-xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#af7e35]/20 backdrop-blur-md border border-[#af7e35]/30 text-[#af7e35] text-xs font-black uppercase tracking-widest">
                  <i className="fas fa-credit-card text-xs" />
                  <span>Paso 2 de 2: Pago Seguro de Inscripción</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  ¡Preinscripción Registrada, {firstName}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Tus datos fueron guardados exitosamente. Para confirmar oficialmente tu vacante en la clase, completa el pago a través de la pasarela de Mercado Pago.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              {/* Banner de Estado Preinscrito */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#fdfbf5] border border-[#e0ceb1]/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#af7e35]/15 text-[#af7e35] flex items-center justify-center font-bold">
                    <i className="fas fa-hourglass-half text-lg" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#af7e35] block">
                      Estado de Inscripción
                    </span>
                    <span className="text-sm font-bold text-[#112842]">
                      Preinscrito · Pendiente de Pago
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[11px] font-bold text-[#666666] block">Código Generado</span>
                  <span className="font-mono text-base font-black text-[#112842] tracking-wider">{codigo}</span>
                </div>
              </div>

              {/* Resumen del Pedido */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block" />
                    <h4 className="text-sm font-black text-[#112842] uppercase tracking-wide">
                      Detalle de Inscripción
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#af7e35]/10 text-[#af7e35] border border-[#af7e35]/30">
                    Vacante en reserva
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* Participante */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[#666666]">Participante:</span>
                    <span className="font-semibold text-[#112842]">{datosRegistrados.nombre_completo}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[#666666]">Correo:</span>
                    <span className="font-semibold text-[#112842]">{datosRegistrados.correo}</span>
                  </div>

                  {/* Cursos */}
                  {datosRegistrados.cursos_registrados && datosRegistrados.cursos_registrados.length > 1 ? (
                    <div className="pt-2 border-t border-dashed border-[#e0ceb1]/80 space-y-2">
                      <span className="text-[#666666] block font-medium">Cursos inscritos:</span>
                      {datosRegistrados.cursos_registrados.map((cr, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-2 pl-2">
                          <div>
                            <p className="font-bold text-[#112842] text-xs">{cr.nombre_curso}</p>
                            <p className="text-[#666666] text-[11px]">{cr.horario_label}</p>
                          </div>
                          <span className="font-black text-[#af7e35] shrink-0">S/ {Number(cr.precio).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[#666666]">Curso:</span>
                      <strong className="text-[#112842] text-right">{datosRegistrados.nombre_curso}</strong>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-3 border-t border-dashed border-[#e0ceb1] flex justify-between items-center text-base">
                    <span className="font-bold text-[#112842]">Total a pagar:</span>
                    <span className="text-xl sm:text-2xl font-black text-[#af7e35]">
                      S/ {Number(datosRegistrados.precio || 100).toFixed(2)} PEN
                    </span>
                  </div>
                </div>
              </div>

              {/* Componente del Botón de Pago con Mercado Pago */}
              <div className="pt-2">
                <BotonMercadoPago
                  titulo={datosRegistrados.nombre_curso}
                  precio={datosRegistrados.precio}
                  cantidad={1}
                  id_preinscripcion={datosRegistrados.id_preinscripcion}
                  ids_preinscripciones={datosRegistrados.ids_preinscripciones}
                  onPagoExitoso={confirmarPagoExitoso}
                />
              </div>

              {/* Aviso de confidencialidad y pasarela */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#666666] text-center pt-2">
                <i className="fas fa-lock text-[#af7e35]" />
                <span>Transacción cifrada y protegida por la infraestructura de Mercado Pago.</span>
              </div>

              {/* Opción de volver */}
              <div className="pt-3 border-t border-slate-100 flex justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#666666] hover:text-[#112842] transition-colors cursor-pointer"
                >
                  ¿Deseas modificar algún dato? <span className="underline font-semibold text-[#af7e35]">Volver a llenar la ficha</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================================
   * PANTALLA DE ÉXITO FINAL (PAGO Y REGISTRO CONFIRMADO) - REDISEÑADA
   * ============================================================================ */
  if (fase === 'exito' && datosRegistrados) {
    const firstName = datosRegistrados.nombre_completo?.split(' ')[0] || 'Participante';
    const operacion = datosRegistrados.numero_operacion || 'Aprobada';

    // Obtener código de clase principal o de la lista
    const codigoClasePrincipal =
      datosRegistrados.codigo_clase ||
      datosRegistrados.cursos_registrados?.[0]?.codigo_clase ||
      (datosRegistrados.id_clase ? `CLS-${datosRegistrados.id_clase}` : 'CLS-01');

    const tieneVariosCursos =
      datosRegistrados.cursos_registrados && datosRegistrados.cursos_registrados.length > 1;

    // Generar formato exacto solicitado: (codigo de clase y nombre de curso)
    const clasesMensaje = tieneVariosCursos
      ? datosRegistrados.cursos_registrados
          .map((c) => `${c.codigo_clase || 'CLS-' + c.id_clase} (${c.nombre_curso})`)
          .join(', ')
      : `${codigoClasePrincipal} (${datosRegistrados.nombre_curso})`;

    const mensajeWa = `Hola, soy ${datosRegistrados.nombre_completo || ''} con correo ${datosRegistrados.correo || ''}, me inscribí a la clase ${clasesMensaje}.`;
    const urlWa = `https://wa.me/51920862919?text=${encodeURIComponent(mensajeWa)}`;

    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#f3eeeef5] via-white to-[#f3eeeef5] py-8 lg:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-[#e0ceb1]/50 shadow-2xl shadow-[#112842]/10 overflow-hidden">
            {/* Cabecera de Éxito */}
            <div className="bg-gradient-to-br from-[#07192d] via-[#112842] to-[#07192d] text-white p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#af7e35]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-xl shadow-emerald-500/30 mb-6 flex items-center justify-center animate-bounce">
                  <div className="w-full h-full rounded-full bg-[#112842] flex items-center justify-center">
                    <i className="fas fa-check-circle text-3xl text-emerald-400" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-3">
                  <i className="fas fa-certificate text-xs" />
                  <span>Inscripción y Pago Confirmados</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  ¡Felicitaciones, {firstName}!
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
                  Tu pago ha sido procesado exitosamente y tu vacante ha sido asegurada en el sistema.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12 space-y-8">
              {/* Resumen de tu Inscripción / Resumen de Compra */}
              <div className="bg-[#fdfbf5] rounded-2xl p-6 sm:p-8 border border-[#e0ceb1]/60 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e0ceb1]/40 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-5 bg-[#af7e35] rounded-full inline-block" />
                    <h4 className="text-lg font-black text-[#112842]">Resumen de tu Inscripción</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
                      <i className="fas fa-check-circle text-emerald-600 text-[10px]" />
                      Estado: Inscrito
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center gap-1.5">
                      <i className="fas fa-credit-card text-blue-600 text-[10px]" />
                      Pago: Pagado
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-medium">
                      Op: {operacion}
                    </span>
                  </div>
                </div>

                {/* Si son múltiples cursos, listamos cada uno con su código de clase */}
                {tieneVariosCursos ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[#666666] block text-xs">Participante</span>
                        <strong className="text-[#112842] text-sm">{datosRegistrados.nombre_completo}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[#666666] block text-xs">Correo Electrónico</span>
                        <strong className="text-[#112842] text-sm">{datosRegistrados.correo}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[#666666] block text-xs">Celular</span>
                        <strong className="text-[#112842] text-sm">{datosRegistrados.celular}</strong>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[#666666] block text-xs">Método de Pago</span>
                        <strong className="text-[#112842] text-sm">Mercado Pago</strong>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
                      <p className="text-xs font-black uppercase tracking-wider text-[#112842] flex items-center gap-2">
                        <i className="fas fa-chalkboard text-[#af7e35]" />
                        Clases y Cursos Inscritos:
                      </p>
                      <div className="space-y-2.5">
                        {datosRegistrados.cursos_registrados.map((cr, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#af7e35]/15 text-[#af7e35] border border-[#af7e35]/30">
                                  {cr.codigo_clase || `CLS-${cr.id_clase}`}
                                </span>
                                <span className="font-bold text-[#112842] text-sm">{cr.nombre_curso}</span>
                              </div>
                              <p className="text-[#666666] text-xs pl-0.5">{cr.horario_label}</p>
                            </div>
                            <span className="font-black text-[#af7e35] text-sm shrink-0 self-end sm:self-center">
                              S/ {Number(cr.precio).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-sm">
                        <span className="font-bold text-[#112842]">Monto Total Abonado:</span>
                        <strong className="text-emerald-700 text-base font-black">
                          S/ {Number(datosRegistrados.precio || 100).toFixed(2)} PEN
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Curso único */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Participante</span>
                      <strong className="text-[#112842] text-sm">{datosRegistrados.nombre_completo}</strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Código de la Clase</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="font-mono text-[#af7e35] text-base font-black tracking-wide">
                          {codigoClasePrincipal}
                        </strong>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(codigoClasePrincipal)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#112842] text-[#112842] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                          title="Copiar Código de Clase"
                        >
                          <i className={`fas ${copiedCode ? 'fa-check text-emerald-500' : 'fa-copy'}`} />
                          <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Curso</span>
                      <strong className="text-[#112842] text-sm">{datosRegistrados.nombre_curso}</strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Celular</span>
                      <strong className="text-[#112842] text-sm">{datosRegistrados.celular}</strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Correo Electrónico</span>
                      <strong className="text-[#112842] text-sm">{datosRegistrados.correo}</strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[#666666] block text-xs">Monto Abonado</span>
                      <strong className="text-emerald-700 text-base font-black">
                        S/ {Number(datosRegistrados.precio || 100).toFixed(2)} PEN
                      </strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 sm:col-span-2">
                      <span className="text-[#666666] block text-xs">Método de Pago</span>
                      <strong className="text-[#112842] text-sm">Mercado Pago</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Paso siguiente: WhatsApp */}
              <div className="text-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border border-emerald-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="inline-flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <i className="fab fa-whatsapp text-emerald-600 text-base" />
                  <span>Acceso al Grupo Oficial</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#112842]">
                  Únete al Grupo de WhatsApp de tu Clase
                </h3>
                <p className="text-sm text-[#444444] max-w-lg mx-auto leading-relaxed">
                  Haz clic en el botón para enviar tu mensaje de confirmación y unirte directamente al grupo de WhatsApp de tu clase con tu docente y compañeros.
                </p>
                <div className="pt-2">
                  <a
                    href={urlWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-base sm:text-lg shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <i className="fab fa-whatsapp text-2xl" />
                    <span>Contactar por WhatsApp para unirme al grupo</span>
                    <i className="fas fa-arrow-right text-sm" />
                  </a>
                </div>
              </div>

              {/* Botones inferiores */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/JBImpulsa"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#112842] hover:text-[#af7e35] transition-colors"
                >
                  <i className="fas fa-arrow-left text-xs" />
                  <span>Volver a la página del curso</span>
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold transition-colors cursor-pointer"
                >
                  Inscribir a otra persona
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================================
   * FORMULARIO PRINCIPAL REDISEÑADO
   * ============================================================================ */
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f3eeeef5] via-white to-[#f3eeeef5] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">

          {/* ===================================================================
           * ASIDE: INFORMACIÓN DE LA CONVOCATORIA REDISEÑADO
           * =================================================================== */}
          <aside className="lg:col-span-4 mb-8 lg:mb-0 lg:sticky lg:top-24 space-y-4">
            {/* Card principal del aside */}
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#112842]/10 border border-[#e0ceb1]/50 bg-white">
              {/* Header con gradiente */}
              <div className="bg-gradient-to-br from-[#07192d] via-[#112842] to-[#07192d] p-7 relative overflow-hidden">
                {/* Elementos decorativos de fondo */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#af7e35]/15 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#af7e35]/10 blur-xl" />
                
                <div className="relative z-10">
                  {/* Badge de estado */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#af7e35]/20 border border-[#af7e35]/30 text-[#af7e35] text-[11px] font-bold uppercase tracking-widest mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#af7e35] animate-pulse" />
                    <span>Convocatoria Abierta 2026</span>
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight tracking-tight">
                    Preinscripción a Capacitaciones
                  </h3>
                  <p className="text-[#af7e35] font-black text-lg mt-1">JB Impulsa</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed font-normal">
                    Vacantes limitadas · Reserva por orden de inscripción
                  </p>
                </div>
              </div>

              {/* Cursos disponibles */}
              <div className="bg-white p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-[#112842] flex items-center gap-2">
                  <i className="fas fa-graduation-cap text-[#af7e35]" />
                  Cursos Disponibles
                </p>

                {estadosDeCarga.errorCursos ? (
                  <p className="text-xs text-red-500">{estadosDeCarga.errorCursos}</p>
                ) : mensajeVacioCursos ? (
                  <p className="text-xs text-slate-500 italic">{mensajeVacioCursos}</p>
                ) : (
                  cursos.map((c) => (
                    <div
                      key={c.id_curso}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                        c.isDisabled ? 'bg-slate-50 opacity-50' : 'bg-[#fdfbf5] border border-[#e0ceb1]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${c.isDisabled ? 'bg-slate-300' : 'bg-[#af7e35]'}`} />
                        <span className={`text-xs font-semibold truncate ${c.isDisabled ? 'text-slate-400 line-through' : 'text-[#112842]'}`}>
                          {c.nombre_curso}
                        </span>
                      </div>
                      {!c.isDisabled && (
                        <span className="text-xs font-black text-[#af7e35] shrink-0">
                          S/ {Number(c.precio).toFixed(0)}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Beneficios */}
              <div className="bg-[#fdfbf5] border-t border-[#e0ceb1]/50 p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-[#112842]">¿Por qué elegirnos?</p>
                {[
                  { icon: 'fa-certificate', text: 'Certificado con valor curricular' },
                  { icon: 'fa-laptop', text: 'Clases en vivo + grabaciones' },
                  { icon: 'fa-users', text: 'Grupos reducidos · Atención personalizada' },
                  { icon: 'fa-shield-alt', text: 'Pago 100% seguro con Mercado Pago' },
                ].map((b) => (
                  <div key={b.icon} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#112842]/8 text-[#af7e35] flex items-center justify-center shrink-0">
                      <i className={`fas ${b.icon} text-xs`} />
                    </div>
                    <span className="text-xs text-[#444444] font-medium">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Pie del aside */}
              <div className="bg-white border-t border-slate-100 p-4 flex items-center justify-center gap-2 text-xs text-[#666666]">
                <i className="fas fa-building text-[#af7e35] text-sm" />
                <span className="font-semibold text-[#112842]">JB Gestión & Capital Humano E.I.R.L.</span>
              </div>
            </div>

            {/* Tarjeta de contacto rápido */}
            <a
              href="https://wa.me/51920862919"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <i className="fab fa-whatsapp text-2xl" />
              </div>
              <div>
                <p className="font-black text-sm">¿Tienes dudas?</p>
                <p className="text-emerald-100 text-xs font-medium">Escríbenos por WhatsApp</p>
              </div>
              <i className="fas fa-arrow-right text-xs ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
            </a>
          </aside>

          {/* ===================================================================
           * COLUMNA PRINCIPAL: FORMULARIO REDISEÑADO
           * =================================================================== */}
          <main className="lg:col-span-8">
            {/* Encabezado del formulario */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112842]/6 border-l-4 border-[#af7e35] text-[11px] font-black uppercase tracking-widest text-[#af7e35] mb-4">
                <i className="fas fa-file-alt text-[10px]" />
                <span>Convocatoria Oficial · 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#112842] tracking-tight leading-tight">
                Ficha de Preinscripción
              </h1>
              <p className="mt-2 text-sm text-[#666666] leading-relaxed max-w-lg font-normal">
                Completa el formulario con precisión. Te contactaremos para coordinar tu acceso al aula virtual y confirmar tu vacante.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* =================================================================
               * 01 DATOS PERSONALES
               * ================================================================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-9">
                <SectionHeader
                  number="01"
                  title="Datos Personales"
                  subtitle="Información para tu constancia y contacto directo"
                />

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nombre completo */}
                  <div className="sm:col-span-2">
                    <FormField
                      label="Nombres y Apellidos Completos"
                      required
                      error={errors.nombre_completo}
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-user text-[#af7e35]/60 text-sm" />
                        </div>
                        <input
                          type="text"
                          name="nombre_completo"
                          value={formData.nombre_completo}
                          onChange={handleChange}
                          placeholder="Ej. María Elena Rojas Huamán"
                          className={`${inputClass(!!errors.nombre_completo)} pl-11`}
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Celular */}
                  <FormField label="Celular / WhatsApp" required error={errors.celular}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none gap-2">
                        <i className="fas fa-phone text-[#af7e35]/60 text-sm" />
                        <span className="text-xs font-bold text-slate-400 border-r border-slate-200 pr-2">+51</span>
                      </div>
                      <input
                        type="tel"
                        name="celular"
                        value={formData.celular}
                        onChange={handleChange}
                        placeholder="920 862 919"
                        className={`${inputClass(!!errors.celular)} pl-20`}
                      />
                    </div>
                  </FormField>

                  {/* Correo */}
                  <FormField label="Correo Electrónico" required error={errors.correo}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-[#af7e35]/60 text-sm" />
                      </div>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                        className={`${inputClass(!!errors.correo)} pl-11`}
                      />
                    </div>
                  </FormField>

                  {/* Ciudad */}
                  <div className="sm:col-span-2">
                    <FormField label="Ciudad / Departamento de Residencia">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-map-marker-alt text-[#af7e35]/60 text-sm" />
                        </div>
                        <select
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          className={`${inputClass(false)} pl-11 pr-10 cursor-pointer appearance-none`}
                        >
                          <option value="">-- Selecciona tu departamento (opcional) --</option>
                          {DEPARTAMENTOS_PERU.map((dep) => (
                            <option key={dep} value={dep}>{dep}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-slate-400 text-xs" />
                        </div>
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>

              {/* =================================================================
               * 02 PERFIL OCUPACIONAL
               * ================================================================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-9">
                <SectionHeader
                  number="02"
                  title="Perfil Ocupacional"
                  subtitle="Nos permite adaptar los casos prácticos a tu contexto laboral"
                />

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Situación ocupacional */}
                  <div className="sm:col-span-2">
                    <FormField
                      label="Situación Ocupacional Actual"
                      required
                      error={errors.situacion_ocupacional}
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-briefcase text-[#af7e35]/60 text-sm" />
                        </div>
                        <select
                          name="situacion_ocupacional"
                          value={formData.situacion_ocupacional}
                          onChange={handleSituacionOcupacionalChange}
                          className={`${inputClass(!!errors.situacion_ocupacional)} pl-11 pr-10 cursor-pointer appearance-none`}
                        >
                          <option value="">-- Selecciona tu situación actual --</option>
                          {SITUACION_OCUPACIONAL_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-slate-400 text-xs" />
                        </div>
                      </div>
                    </FormField>
                  </div>

                  {/* Condicional: Estudiante o egresado */}
                  {formData.situacion_ocupacional === 'Estudiante o egresado' && (
                    <div className="sm:col-span-2">
                      <FormField
                        label="Centro de Estudios (Universidad/Instituto)"
                        required
                        error={errors.centro_estudios}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-graduation-cap text-[#af7e35]/60 text-sm" />
                          </div>
                          <input
                            type="text"
                            name="centro_estudios"
                            value={formData.centro_estudios || ''}
                            onChange={handleChange}
                            placeholder="Ej. UNMSM, PUCP, Tecsup, Zegel IPAE, Certus…"
                            className={`${inputClass(!!errors.centro_estudios)} pl-11`}
                          />
                        </div>
                      </FormField>
                    </div>
                  )}

                  {/* Condicional: Trabajador dependiente (Planilla) */}
                  {formData.situacion_ocupacional === 'Trabajador dependiente (Planilla)' && (
                    <div className="sm:col-span-2">
                      <FormField
                        label="Empresa donde labora"
                        required
                        error={errors.empresa_emprendimiento}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-building text-[#af7e35]/60 text-sm" />
                          </div>
                          <input
                            type="text"
                            name="empresa_emprendimiento"
                            value={formData.empresa_emprendimiento || ''}
                            onChange={handleChange}
                            placeholder="Ej. BCP, Rímac Seguros, Minera Las Bambas, Corporación Textil S.A.C.…"
                            className={`${inputClass(!!errors.empresa_emprendimiento)} pl-11`}
                          />
                        </div>
                      </FormField>
                    </div>
                  )}

                  {/* Condicional: Empresario / Dueño de negocio / MYPE */}
                  {formData.situacion_ocupacional === 'Empresario / Dueño de negocio / MYPE' && (
                    <>
                      <div className="sm:col-span-1">
                        <FormField
                          label="Nombre de su Empresa o Emprendimiento"
                          required
                          error={errors.empresa_emprendimiento}
                        >
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <i className="fas fa-store text-[#af7e35]/60 text-sm" />
                            </div>
                            <input
                              type="text"
                              name="empresa_emprendimiento"
                              value={formData.empresa_emprendimiento || ''}
                              onChange={handleChange}
                              placeholder="Ej. Consultora Contable & Asociados S.A.C."
                              className={`${inputClass(!!errors.empresa_emprendimiento)} pl-11`}
                            />
                          </div>
                        </FormField>
                      </div>

                      <div className="sm:col-span-1">
                        <FormField
                          label="Número de Trabajadores"
                          required
                          error={errors.numero_trabajadores}
                        >
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <i className="fas fa-users text-[#af7e35]/60 text-sm" />
                            </div>
                            <select
                              name="numero_trabajadores"
                              value={formData.numero_trabajadores || ''}
                              onChange={handleChange}
                              className={`${inputClass(!!errors.numero_trabajadores)} pl-11 pr-10 cursor-pointer appearance-none`}
                            >
                              <option value="">-- Selecciona el número de trabajadores --</option>
                              <option value="1-5">1 a 5 trabajadores</option>
                              <option value="6-20">6 a 20 trabajadores</option>
                              <option value="21-50">21 a 50 trabajadores</option>
                              <option value="más de 50">Más de 50 trabajadores</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <i className="fas fa-chevron-down text-slate-400 text-xs" />
                            </div>
                          </div>
                        </FormField>
                      </div>
                    </>
                  )}

                  {/* Área de interés o especialidad (obligatorio para todos) */}
                  <div className="sm:col-span-2">
                    <FormField
                      label="Área de Interés o Especialidad"
                      required
                      error={errors.area_interes}
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-layer-group text-[#af7e35]/60 text-sm" />
                        </div>
                        <input
                          type="text"
                          name="area_interes"
                          value={formData.area_interes || ''}
                          onChange={handleChange}
                          placeholder="Ej. Recursos Humanos, Contabilidad, Administración, Planillas…"
                          className={`${inputClass(!!errors.area_interes)} pl-11`}
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>

              {/* =================================================================
               * 03 CURSO Y HORARIO (Multi-curso con Acordeón)
               * ================================================================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-9">
                <SectionHeader
                  number="03"
                  title="Curso y Horario"
                  subtitle="Puedes inscribirte a uno o más cursos. Haz clic en un curso para ver y seleccionar sus horarios."
                />

                <div className="mt-6 space-y-3">
                  {estadosDeCarga.errorCursos ? (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                      <i className="fas fa-circle-exclamation" />
                      <span>{estadosDeCarga.errorCursos}</span>
                    </div>
                  ) : mensajeVacioCursos ? (
                    <div className="p-4 rounded-2xl bg-[#fdfbf5] border border-[#e0ceb1] text-[#af7e35] text-sm font-medium flex items-center gap-2">
                      <i className="fas fa-info-circle" />
                      <span>{mensajeVacioCursos}</span>
                    </div>
                  ) : (
                    cursos.map((curso) => {
                      const estaExpandido = cursoExpandido === curso.id_curso;
                      const horariosDeCurso = horariosPorCurso[curso.id_curso] || [];
                      const seleccionActual = formData.cursos_seleccionados.find(
                        (cs) => String(cs.id_curso) === String(curso.id_curso)
                      );
                      const estaSeleccionado = !!seleccionActual;

                      return (
                        <div
                          key={curso.id_curso}
                          className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                            curso.isDisabled
                              ? 'border-slate-100 bg-slate-50 opacity-50'
                              : estaSeleccionado
                              ? 'border-[#af7e35] bg-gradient-to-r from-[#fdfbf5] to-white shadow-lg shadow-[#af7e35]/15'
                              : estaExpandido
                              ? 'border-[#112842]/25 bg-[#112842]/2 shadow-md'
                              : 'border-slate-200 bg-white hover:border-[#af7e35]/40 hover:shadow-sm'
                          }`}
                        >
                          {/* Header de la tarjeta de curso */}
                          <button
                            type="button"
                            disabled={curso.isDisabled}
                            onClick={() => !curso.isDisabled && toggleCurso(curso.id_curso)}
                            className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between gap-4 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Indicador circular */}
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  estaSeleccionado ? 'border-[#af7e35] bg-[#af7e35]' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {estaSeleccionado && <i className="fas fa-check text-white text-[9px]" />}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold text-sm leading-tight ${curso.isDisabled ? 'text-slate-400' : 'text-[#112842]'}`}>
                                  {curso.nombre_curso}
                                  {curso.isDisabled && (
                                    <span className="ml-2 text-xs font-normal text-slate-400">(Agotado)</span>
                                  )}
                                </p>
                                {estaSeleccionado ? (
                                  <p className="text-[11px] text-[#af7e35] font-semibold mt-1 flex items-center gap-1 truncate">
                                    <i className="fas fa-clock text-[9px]" />
                                    <span>{seleccionActual.horario_label}</span>
                                  </p>
                                ) : (
                                  !curso.isDisabled && (
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                      {curso.vacantes_totales > 0
                                        ? `${curso.vacantes_totales} vacante${curso.vacantes_totales !== 1 ? 's' : ''} disponible${curso.vacantes_totales !== 1 ? 's' : ''}`
                                        : 'Sin vacantes'}
                                    </p>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <p className={`text-base sm:text-lg font-black ${curso.isDisabled ? 'text-slate-300' : 'text-[#af7e35]'}`}>
                                  S/ {Number(curso.precio).toFixed(0)}
                                </p>
                                {!curso.isDisabled && <p className="text-[10px] text-slate-400">PEN</p>}
                              </div>
                              {!curso.isDisabled && (
                                <div
                                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                    estaExpandido
                                      ? 'border-[#112842] bg-[#112842] text-white'
                                      : 'border-slate-200 text-slate-400'
                                  }`}
                                >
                                  <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${estaExpandido ? 'rotate-180' : ''}`} />
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Panel de horarios expandido */}
                          {estaExpandido && !curso.isDisabled && (
                            <div className="border-t-2 border-dashed border-[#e0ceb1] mx-4 mb-4" />
                          )}
                          {estaExpandido && !curso.isDisabled && (
                            <div className="px-5 sm:px-6 pb-5 space-y-2">
                              <p className="text-xs font-black uppercase tracking-wider text-[#666666] mb-3 flex items-center gap-2">
                                <i className="fas fa-calendar-alt text-[#af7e35]" />
                                Selecciona un horario:
                              </p>

                              {horariosDeCurso.length === 0 ? (
                                <div className="p-3.5 rounded-xl bg-[#fdfbf5] border border-[#e0ceb1] text-[#af7e35] text-xs flex items-center gap-2">
                                  <i className="fas fa-clock" />
                                  <span>No hay horarios disponibles para este curso actualmente.</span>
                                </div>
                              ) : (
                                horariosDeCurso.map((horario) => {
                                  const esHorarioSeleccionado =
                                    estaSeleccionado && String(seleccionActual.id_clase) === String(horario.id_clase);

                                  return (
                                    <button
                                      key={horario.id_clase}
                                      type="button"
                                      disabled={horario.isAgotado}
                                      onClick={() =>
                                        !horario.isAgotado &&
                                        seleccionarHorario(horario.id_clase, curso.id_curso)
                                      }
                                      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-xs cursor-pointer disabled:cursor-not-allowed ${
                                        horario.isAgotado
                                          ? 'border-slate-100 bg-slate-50 text-slate-300'
                                          : esHorarioSeleccionado
                                          ? 'border-[#af7e35] bg-[#fdfbf5] text-[#112842] shadow-sm'
                                          : 'border-slate-100 bg-white text-[#444444] hover:border-[#af7e35]/50 hover:bg-[#fdfbf5]/50'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                          <div
                                            className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                              esHorarioSeleccionado ? 'border-[#af7e35] bg-[#af7e35]' : 'border-slate-200'
                                            }`}
                                          >
                                            {esHorarioSeleccionado && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                          <div>
                                            <p className={`font-semibold leading-snug ${horario.isAgotado ? 'text-slate-300' : 'text-[#112842]'}`}>
                                              {horario.label}
                                            </p>
                                            {horario.isAgotado ? (
                                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 mt-1">
                                                <i className="fas fa-times-circle text-[9px]" />
                                                Sin vacantes disponibles
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-slate-400 mt-0.5 block">
                                                {horario.vacantes_disponibles} lugar{horario.vacantes_disponibles !== 1 ? 'es' : ''} disponible{horario.vacantes_disponibles !== 1 ? 's' : ''}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        {esHorarioSeleccionado && (
                                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#af7e35] shrink-0 bg-[#af7e35]/10 px-2 py-1 rounded-lg">
                                            <i className="fas fa-check text-[9px]" />
                                            Seleccionado
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {/* Error de validación de cursos */}
                  {errors.cursos_seleccionados && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium animate-pulse">
                      <i className="fas fa-circle-exclamation text-[10px]" />
                      <span>{errors.cursos_seleccionados}</span>
                    </p>
                  )}

                  {/* Resumen de cursos seleccionados (Carrito) */}
                  {formData.cursos_seleccionados.length > 0 && (
                    <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-[#112842]/5 to-[#af7e35]/5 border border-[#af7e35]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-[#112842] text-[#af7e35] flex items-center justify-center">
                          <i className="fas fa-shopping-cart text-xs" />
                        </div>
                        <span className="text-sm font-black text-[#112842]">
                          Cursos en tu inscripción ({formData.cursos_seleccionados.length})
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {formData.cursos_seleccionados.map((cs) => (
                          <div
                            key={cs.id_curso}
                            className="flex items-start justify-between gap-3 bg-white rounded-xl p-3.5 border border-[#e0ceb1]/60 shadow-xs"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#112842] truncate">{cs.nombre_curso}</p>
                              <p className="text-xs text-[#666666] truncate flex items-center gap-1 mt-0.5">
                                <i className="fas fa-clock text-[#af7e35] text-[9px]" />
                                <span>{cs.horario_label}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-black text-[#af7e35]">
                                S/ {Number(cs.precio).toFixed(0)}
                              </span>
                              <button
                                type="button"
                                onClick={() => deseleccionarCurso(cs.id_curso)}
                                className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
                                title="Quitar curso"
                              >
                                <i className="fas fa-xmark text-[10px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t-2 border-dashed border-[#e0ceb1] flex justify-between items-center">
                        <span className="text-sm font-bold text-[#444444]">Total a pagar:</span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#af7e35]">
                            S/ {formData.cursos_seleccionados.reduce((sum, cs) => sum + Number(cs.precio || 0), 0).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">PEN</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================================
               * 04 INTERÉS EN LA CAPACITACIÓN
               * ================================================================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-9">
                <SectionHeader
                  number="04"
                  title="Interés en la Capacitación"
                  subtitle="Cuéntanos sobre tus conocimientos y objetivos profesionales"
                />

                <div className="mt-6 space-y-5">
                  {/* Nivel de conocimiento */}
                  <FormField
                    label="Nivel de Conocimiento Previo en el Tema"
                    required
                    error={errors.nivel_conocimiento}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-chart-line text-[#af7e35]/60 text-sm" />
                      </div>
                      <select
                        name="nivel_conocimiento"
                        value={formData.nivel_conocimiento}
                        onChange={handleChange}
                        className={`${inputClass(!!errors.nivel_conocimiento)} pl-11 pr-10 cursor-pointer appearance-none`}
                      >
                        <option value="">-- Selecciona tu nivel actual --</option>
                        {NIVEL_CONOCIMIENTO_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs" />
                      </div>
                    </div>
                  </FormField>

                  {/* Objetivo del curso */}
                  <FormField
                    label="¿Qué esperas aprender o qué problema deseas resolver?"
                    hint="Opcional pero recomendado para que el docente oriente los casos reales"
                  >
                    <textarea
                      name="objetivo_curso"
                      rows={3}
                      value={formData.objetivo_curso}
                      onChange={handleChange}
                      placeholder="Ej. Dominar el cálculo de devengados, regularizar planillas, evitar multas de SUNAFIL…"
                      className={`${inputClass(false)} resize-y`}
                    />
                  </FormField>
                </div>
              </div>

              {/* =================================================================
               * 05 INFORMACIÓN Y AUTORIZACIONES + SUBMIT
               * ================================================================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 sm:p-9 space-y-6">
                <SectionHeader
                  number="05"
                  title="Información y Autorizaciones"
                  subtitle="Privacidad conforme a Ley N.º 29733 y canales de contacto"
                />

                <div className="space-y-5">
                  {/* Cómo conociste */}
                  <FormField
                    label="¿Cómo conociste de esta capacitación?"
                    required
                    error={errors.origen_contacto}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-bullhorn text-[#af7e35]/60 text-sm" />
                      </div>
                      <select
                        name="origen_contacto"
                        value={formData.origen_contacto}
                        onChange={handleChange}
                        className={`${inputClass(!!errors.origen_contacto)} pl-11 pr-10 cursor-pointer appearance-none`}
                      >
                        <option value="">-- Selecciona una opción --</option>
                        {COMO_CONOCISTE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs" />
                      </div>
                    </div>
                  </FormField>

                  {/* Política de privacidad */}
                  <div
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      formData.acepta_privacidad
                        ? 'border-[#af7e35]/40 bg-[#fdfbf5]'
                        : errors.acepta_privacidad
                        ? 'border-red-300 bg-red-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          formData.acepta_privacidad ? 'border-[#af7e35] bg-[#af7e35]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {formData.acepta_privacidad && <i className="fas fa-check text-white text-[9px]" />}
                      </div>
                      <input
                        type="checkbox"
                        name="acepta_privacidad"
                        checked={formData.acepta_privacidad}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm text-[#444444] leading-relaxed font-normal">
                        He leído y acepto la{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onOpenPrivacyPolicy?.();
                          }}
                          className="text-[#af7e35] font-bold underline hover:text-[#8e6d23] cursor-pointer inline"
                        >
                          política de privacidad
                        </button>{' '}
                        y autorizo el tratamiento de mis datos personales para gestionar mi preinscripción conforme a la Ley N.º 29733.{' '}
                        <span className="text-[#af7e35] font-bold">*</span>
                      </span>
                    </label>
                    {errors.acepta_privacidad && (
                      <p className="text-red-500 text-xs mt-2 pl-8 flex items-center gap-1 font-medium animate-pulse">
                        <i className="fas fa-circle-exclamation text-[10px]" />
                        <span>{errors.acepta_privacidad}</span>
                      </p>
                    )}
                  </div>

                  {/* Marketing (opcional) */}
                  <div
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      formData.acepta_marketing ? 'border-[#af7e35]/30 bg-[#fdfbf5]' : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          formData.acepta_marketing ? 'border-[#af7e35] bg-[#af7e35]' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {formData.acepta_marketing && <i className="fas fa-check text-white text-[9px]" />}
                      </div>
                      <input
                        type="checkbox"
                        name="acepta_marketing"
                        checked={formData.acepta_marketing}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm text-[#666666] leading-relaxed font-normal">
                        Deseo recibir información sobre futuros cursos prácticos y beneficios exclusivos de JB Gestión &amp; Capital Humano E.I.R.L.{' '}
                        <span className="text-slate-400 text-xs">(Opcional)</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Error de envío */}
                {estadosDeCarga.errorEnvio && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                    <i className="fas fa-circle-exclamation mt-0.5 shrink-0 text-red-500" />
                    <span>{estadosDeCarga.errorEnvio}</span>
                  </div>
                )}

                {/* Botón de envío principal */}
                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden py-5 px-8 rounded-2xl bg-gradient-to-r from-[#af7e35] via-[#c49040] to-[#8e6d23] hover:from-[#8e6d23] hover:via-[#af7e35] hover:to-[#af7e35] text-white font-black text-lg tracking-wide shadow-xl shadow-[#af7e35]/30 hover:shadow-2xl hover:shadow-[#af7e35]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
                  >
                    {/* Shimmer decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />

                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-xl" />
                        <span>Procesando tu preinscripción…</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock text-base" />
                        <span>Completar Preinscripción y Pagar</span>
                        <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <i className="fas fa-shield-alt text-[#af7e35]" />
                    <span>Tus datos viajan protegidos bajo cifrado y confidencialidad profesional.</span>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default FormInscripcion;
