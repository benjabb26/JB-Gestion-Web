/**
 * @fileoverview Custom Hook para gestión de datos y estado del carrusel de Cursos Disponibles.
 * Consume Supabase ('cursos'), normaliza la estructura, asocia temarios y gestiona navegación interactiva.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../../configs/supabaseConfig';
import { obtenerTemarioCurso } from '../data/temariosConfig';

/**
 * Asigna una imagen temática representativa según el curso o capacitación profesional.
 * @param {Object} curso 
 * @returns {string} Ruta de la imagen
 */
export function obtenerImagenCurso(curso) {
  if (!curso || typeof curso !== 'object') {
    return '/img_soluciones/SOLUCION4.1.jpg';
  }

  // 1. Si viene con imagen_url o imagen válida desde Supabase (que no sea el placeholder del Hero)
  const imgDirecta = curso.imagen_url || curso.imagen;
  if (
    imgDirecta &&
    typeof imgDirecta === 'string' &&
    imgDirecta.trim() &&
    !imgDirecta.includes('Panel_Course.jpg')
  ) {
    return imgDirecta.trim();
  }

  const texto = `${curso.nombre_curso || ''} ${curso.codigo_curso || ''} ${curso.descripcion || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Legislación Laboral o contratos (escritorio corporativo con planilla y beneficios laborales)
  if (
    texto.includes('legislacion') ||
    texto.includes('laboral') ||
    texto.includes('contrat') ||
    texto.includes('despido') ||
    texto.includes('sunafil')
  ) {
    return '/img_soluciones/SOLUCION1.2.jpg';
  }

  // 3. T-Registro, PLAME, Planillas SUNAT (gestión tributaria y declaraciones en laptop)
  if (
    texto.includes('t-registro') ||
    texto.includes('tregistro') ||
    texto.includes('plame') ||
    texto.includes('sunat') ||
    texto.includes('tributar')
  ) {
    return '/img_soluciones/SOLUCION3.1.jpg';
  }

  // 4. Sistemas Pensionarios, AFP, ONP o capacitación profesional por defecto
  // (Ilustración 3D de capacitación profesional con laptop transmitiendo clase, libros y birrete)
  return '/img_soluciones/SOLUCION4.1.jpg';
}

/**
 * Catálogo de respaldo (Fallback) para desarrollo offline o base de datos vacía.
 */
export const FALLBACK_CURSOS = [
  {
    id_curso: 1,
    id: 1,
    codigo_curso: 'JBI-AFP-001',
    nombre_curso: 'Sistemas Pensionarios en el Perú · AFP, ONP y AFPnet',
    titulo: 'Sistemas Pensionarios en el Perú · AFP, ONP y AFPnet',
    descripcion: 'Domina el marco legal y operativo de los aportes previsionales en el Perú. Aprende el cálculo de retenciones, aportes a AFP y ONP, y la declaración en AFPNET con casos prácticos.',
    precio: 100,
    precio_formateado: 'S/ 100.00',
    modalidad: '100% Virtual en Vivo',
    duracion: '4 Sesiones (8 Horas)',
    nivel: 'Intermedio / Práctico',
    certificacion: 'Certificado Oficial Incluido',
    imagen: '/img_soluciones/SOLUCION4.1.jpg',
    temario: {
      tieneTemario: true,
      url: encodeURI('/temarios_cursos/TEMARIO-Regimen Pensionario_AFP_ONP_AFPNET.pdf'),
      mensajeNoDisponible: '',
    },
  },
  {
    id_curso: 2,
    id: 2,
    codigo_curso: 'JBI-LEG-002',
    nombre_curso: 'Legislación Laboral y Modalidades de Contratación',
    titulo: 'Legislación Laboral y Modalidades de Contratación',
    descripcion: 'Aprende los tipos de contratos laborales según modalidad, periodos de prueba, suspensiones y formalidades exigidas por la normativa peruana y fiscalización de SUNAFIL.',
    precio: 120,
    precio_formateado: 'S/ 120.00',
    modalidad: '100% Virtual en Vivo',
    duracion: '4 Sesiones (8 Horas)',
    nivel: 'Intermedio / Práctico',
    certificacion: 'Certificado Oficial Incluido',
    imagen: '/img_soluciones/SOLUCION1.2.jpg',
    temario: {
      tieneTemario: false,
      url: null,
      mensajeNoDisponible: 'Temario próximamente disponible.',
    },
  },
  {
    id_curso: 3,
    id: 3,
    codigo_curso: 'JBI-PLM-003',
    nombre_curso: 'T-Registro y Planilla Mensual de Pagos (PLAME)',
    titulo: 'T-Registro y Planilla Mensual de Pagos (PLAME)',
    descripcion: 'Gestión y declaración paso a paso en el T-Registro y PLAME de SUNAT. Alta de colaboradores, derechohabientes, cálculo de aportes y tributos laborales sin contingencias.',
    precio: 150,
    precio_formateado: 'S/ 150.00',
    modalidad: '100% Virtual en Vivo',
    duracion: '6 Sesiones (12 Horas)',
    nivel: 'Avanzado / Aplicativo',
    certificacion: 'Certificado Oficial Incluido',
    imagen: '/img_soluciones/SOLUCION3.1.jpg',
    temario: {
      tieneTemario: false,
      url: null,
      mensajeNoDisponible: 'Temario próximamente disponible.',
    },
  },
];

/**
 * Formatea un número al estándar monetario en Soles (S/ 00.00).
 * @param {number|string} valor 
 * @returns {string}
 */
function formatearPrecio(valor) {
  const num = Number(valor);
  if (isNaN(num) || num < 0) return 'S/ 0.00';
  return `S/ ${num.toFixed(2)}`;
}

/**
 * Normaliza un registro de curso proveniente de Supabase para su consumo homogéneo en UI.
 * @param {Object} curso 
 * @param {number} index 
 * @returns {Object}
 */
function normalizarCurso(curso, index = 0) {
  const temarioInfo = obtenerTemarioCurso(curso);
  const precioNum = Number(curso.precio) || 0;
  const imagenCurso = obtenerImagenCurso(curso);

  return {
    id_curso: curso.id_curso ?? (index + 1),
    id: curso.id_curso ?? (index + 1),
    codigo_curso: curso.codigo_curso || `CUR-${curso.id_curso || index + 1}`,
    nombre_curso: curso.nombre_curso || 'Curso de Capacitación Profesional',
    titulo: curso.nombre_curso || 'Curso de Capacitación Profesional',
    descripcion:
      curso.descripcion ||
      curso.detalle ||
      'Programa especializado con enfoque técnico y normativo aplicable al entorno laboral peruano.',
    precio: precioNum,
    precio_formateado: formatearPrecio(precioNum),
    temario: temarioInfo,
    modalidad: curso.modalidad || '100% Virtual en Vivo',
    duracion: curso.duracion || '4 Sesiones (8 Horas)',
    nivel: curso.nivel || 'Especializado',
    certificacion: curso.certificacion || 'Certificado Oficial Incluido',
    imagen: imagenCurso,
  };
}

/**
 * Hook principal para obtener cursos disponibles y controlar el estado del carrusel interactivo.
 * 
 * @returns {Object} Datos, estados de carga y controladores de carrusel
 */
export function useCursosDisponibles() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Carga y sincronización de datos con Supabase
  useEffect(() => {
    let cancelled = false;

    async function cargarCursos() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: dbError } = await supabase
          .from('cursos')
          .select('*')
          .order('id_curso', { ascending: true });

        if (cancelled) return;

        if (dbError) {
          console.warn('[useCursosDisponibles] Aviso de consulta Supabase, activando respaldo:', dbError.message);
          setCursos(FALLBACK_CURSOS);
          setError(null);
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          const normalizados = data.map((c, idx) => normalizarCurso(c, idx));
          setCursos(normalizados);
        } else {
          setCursos(FALLBACK_CURSOS);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useCursosDisponibles] Error inesperado:', err);
          setCursos(FALLBACK_CURSOS);
          setError(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    cargarCursos();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Validación de límites en el índice si la lista cambia
  useEffect(() => {
    if (currentIndex >= cursos.length && cursos.length > 0) {
      setCurrentIndex(0);
    }
  }, [cursos.length, currentIndex]);

  // 3. Controladores de navegación del carrusel con ciclo infinito
  const totalCursos = cursos.length;

  const nextCourse = useCallback(() => {
    setCurrentIndex((prev) => (totalCursos > 0 ? (prev + 1) % totalCursos : 0));
  }, [totalCursos]);

  const prevCourse = useCallback(() => {
    setCurrentIndex((prev) => (totalCursos > 0 ? (prev - 1 + totalCursos) % totalCursos : 0));
  }, [totalCursos]);

  const goToCourse = useCallback(
    (index) => {
      if (typeof index !== 'number' || isNaN(index)) return;
      if (index >= 0 && index < totalCursos) {
        setCurrentIndex(index);
      }
    },
    [totalCursos]
  );

  return {
    // Lista de cursos y curso actualmente activo
    cursos,
    cursoActivo: cursos[currentIndex] || null,
    totalCursos,

    // Estados de petición
    loading,
    error,

    // Control y estado del carrusel
    currentIndex,
    nextCourse,
    prevCourse,
    goToCourse,
  };
}

export default useCursosDisponibles;
