/**
 * @fileoverview Utilidad de formateo y agrupamiento de horarios para clases y sesiones.
 * Formatea el rango de fechas de la clase, el patrón de días/horas agrupado y las vacantes disponibles.
 * 
 * Formato de salida:
 * "15 Nov - 15 Dic | Lunes de 17:00 a 19:00 | Quedan 53 vacantes disponibles"
 */

/**
 * Instancia una fecha asegurando zona horaria local neutra (T00:00:00) para evitar desfases en UTC-5 (Perú).
 * @param {string|Date} fecha 
 * @returns {Date|null}
 */
function crearFechaLocal(fecha) {
  if (!fecha) return null;
  const fechaStr = String(fecha).trim();
  if (!fechaStr) return null;
  const soloFecha = fechaStr.includes('T') ? fechaStr.split('T')[0] : fechaStr;
  const d = new Date(`${soloFecha}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formatea una fecha como "15 Nov" (día numérico y mes abreviado con mayúscula inicial).
 * @param {string|Date} fecha 
 * @returns {string|null}
 */
function formatearDiaMes(fecha) {
  const d = crearFechaLocal(fecha);
  if (!d) return null;

  const dia = d.getDate();
  let mes = '';
  try {
    mes = d.toLocaleDateString('es-PE', { month: 'short' });
    mes = mes.replace(/\./g, '').trim();
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
  } catch (_e) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    mes = meses[d.getMonth()];
  }
  return `${dia} ${mes}`;
}

/**
 * Obtiene el día de la semana con la primera letra en mayúscula (ej: "Lunes", "Martes").
 * @param {string|Date} fecha 
 * @returns {string}
 */
function obtenerDiaSemana(fecha) {
  const d = crearFechaLocal(fecha);
  if (!d) return '';

  let diaSemana = '';
  try {
    diaSemana = d.toLocaleDateString('es-PE', { weekday: 'long' });
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  } catch (_e) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    diaSemana = dias[d.getDay()];
  }
  return diaSemana;
}

/**
 * Formatea una clase y sus sesiones asociadas en una etiqueta única y legible.
 * 
 * @param {Object} clase Objeto de clase (con id_clase, vacantes_totales, vacantes_disponibles, fecha_inicio, fecha_fin)
 * @param {Array} sesiones Array de sesiones de la clase (con fecha_clase, hora_inicio, hora_fin)
 * @returns {string} Ej: "15 Nov - 15 Dic | Lunes de 17:00 a 19:00 | Quedan 53 vacantes disponibles"
 */
export function formatearHorariosClase(clase, sesiones = []) {
  const sesionesValidas = Array.isArray(sesiones) ? [...sesiones] : [];
  sesionesValidas.sort((a, b) => {
    if ((a.fecha_clase || '') < (b.fecha_clase || '')) return -1;
    if ((a.fecha_clase || '') > (b.fecha_clase || '')) return 1;
    return (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
  });

  // 1. Rango de fechas (inicio - fin)
  const fechaInicioRaw = clase?.fecha_inicio || sesionesValidas[0]?.fecha_clase || null;
  const fechaFinRaw = clase?.fecha_fin || sesionesValidas[sesionesValidas.length - 1]?.fecha_clase || null;

  const inicioFormateado = formatearDiaMes(fechaInicioRaw);
  const finFormateado = formatearDiaMes(fechaFinRaw);

  let textoRangoFechas = 'Fecha a confirmar';
  if (inicioFormateado && finFormateado) {
    textoRangoFechas = inicioFormateado === finFormateado
      ? inicioFormateado
      : `${inicioFormateado} - ${finFormateado}`;
  } else if (inicioFormateado) {
    textoRangoFechas = inicioFormateado;
  } else if (finFormateado) {
    textoRangoFechas = finFormateado;
  }

  // 2. Patrón de horarios agrupados y deduplicados
  const patronesHorario = new Set();
  sesionesValidas.forEach((s) => {
    const diaSemana = obtenerDiaSemana(s?.fecha_clase);
    const horaInicio = s?.hora_inicio ? String(s.hora_inicio).slice(0, 5) : '';
    const horaFin = s?.hora_fin ? String(s.hora_fin).slice(0, 5) : '';

    if (diaSemana && horaInicio && horaFin) {
      patronesHorario.add(`${diaSemana} de ${horaInicio} a ${horaFin}`);
    } else if (diaSemana && horaInicio) {
      patronesHorario.add(`${diaSemana} de ${horaInicio}`);
    } else if (diaSemana) {
      patronesHorario.add(diaSemana);
    }
  });

  const textoHorarios = patronesHorario.size > 0
    ? Array.from(patronesHorario).join(', ')
    : 'Horario a confirmar';

  // 3. Vacantes
  const vacantes = clase?.vacantes_totales ?? clase?.vacantes_disponibles ?? 0;

  return `${textoRangoFechas} | ${textoHorarios} | Quedan ${vacantes} vacantes disponibles`;
}

export default formatearHorariosClase;
