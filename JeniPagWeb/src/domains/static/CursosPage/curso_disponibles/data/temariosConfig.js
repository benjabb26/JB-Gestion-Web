/**
 * @fileoverview Configuración centralizada de enlaces a temarios descargables de cursos.
 * Permite asociar cualquier curso (por código, nombre o palabras clave) a su documento PDF correspondiente.
 */

// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DE TEMARIOS DE CURSOS
// Para añadir o cambiar el enlace del temario de cualquier curso, edita este objeto:
// ============================================================================
export const TEMARIOS_POR_CURSO = {
  'sistemas pensionarios': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'sistema pensionario': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'sistemas pensiones': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'sistema pensiones': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'regimen pensionario': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'regimen y sistema pensionario': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'pensionario': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'pensionarios': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'pensiones': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'pension': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'afp': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'onp': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'afpnet': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'JBI-AFP-001': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  'JBI-AFP': '/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf',
  // Puedes añadir nuevos enlaces aquí:
  // 'nombre_del_curso': '/temarios_cursos/mi_archivo.pdf',
};

/**
 * Normaliza un texto para comparaciones flexibles (minúsculas, sin tildes, sin espacios residuales).
 * @param {string} texto 
 * @returns {string}
 */
function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Helper para obtener la información y el enlace de descarga del temario de un curso.
 * Incluye matching por igualdad exacta, contención y por tokens/palabras clave (singular/plural).
 * 
 * @param {Object} curso Objeto con los datos del curso ({ id_curso, nombre_curso, codigo_curso, ... })
 * @returns {{ tieneTemario: boolean, url: string | null, mensajeNoDisponible: string }}
 */
export function obtenerTemarioCurso(curso) {
  if (!curso || typeof curso !== 'object') {
    return {
      tieneTemario: false,
      url: null,
      mensajeNoDisponible: 'Curso no disponible o no especificado.',
    };
  }

  // 1. Si el registro ya trae una URL directa de temario desde la base de datos
  const urlDirecta = curso.temario_url || curso.url_temario;
  if (urlDirecta && typeof urlDirecta === 'string' && urlDirecta.trim()) {
    return {
      tieneTemario: true,
      url: encodeURI(urlDirecta.trim()),
      mensajeNoDisponible: '',
    };
  }

  const codigoNorm = normalizarTexto(curso.codigo_curso);
  const nombreNorm = normalizarTexto(curso.nombre_curso);

  // 2. Coincidencia exacta o por inclusión directa
  for (const [clave, url] of Object.entries(TEMARIOS_POR_CURSO)) {
    if (!url || typeof url !== 'string') continue;
    const claveNorm = normalizarTexto(clave);
    if (!claveNorm) continue;

    // A. Coincidencia exacta por código o nombre
    if ((codigoNorm && codigoNorm === claveNorm) || (nombreNorm && nombreNorm === claveNorm)) {
      return {
        tieneTemario: true,
        url: encodeURI(url.trim()),
        mensajeNoDisponible: '',
      };
    }

    // B. Coincidencia por inclusión de términos clave
    if (
      (codigoNorm && (codigoNorm.includes(claveNorm) || claveNorm.includes(codigoNorm))) ||
      (nombreNorm && (nombreNorm.includes(claveNorm) || claveNorm.includes(nombreNorm)))
    ) {
      return {
        tieneTemario: true,
        url: encodeURI(url.trim()),
        mensajeNoDisponible: '',
      };
    }
  }

  // 3. Coincidencia por tokens / palabras individuales (resuelve variaciones en plural y puntuación)
  const tokens = `${nombreNorm} ${codigoNorm}`.split(/[\s·,_\-–—()/]+/);
  for (const [clave, url] of Object.entries(TEMARIOS_POR_CURSO)) {
    if (!url || typeof url !== 'string') continue;
    const claveNorm = normalizarTexto(clave);
    if (!claveNorm) continue;

    if (tokens.includes(claveNorm)) {
      return {
        tieneTemario: true,
        url: encodeURI(url.trim()),
        mensajeNoDisponible: '',
      };
    }
  }

  // 4. Fallback cuando el curso no tiene temario cargado todavía
  return {
    tieneTemario: false,
    url: null,
    mensajeNoDisponible: 'Temario próximamente disponible.',
  };
}

export default {
  TEMARIOS_POR_CURSO,
  obtenerTemarioCurso,
};
