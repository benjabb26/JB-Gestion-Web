import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../../../configs/supabaseConfig';
import { formatearHorariosClase } from '../utils/formatearHorarios';

/* ============================================================================
 * ESTADO INICIAL DEL FORMULARIO
 * Estructura plana alineada a las tablas de Supabase:
 *   personas, perfiles_profesionales, preinscripciones, respuestas_formulario, pagos
 * ============================================================================ */
const INITIAL_FORM_DATA = {
  // 01 DATOS PERSONALES
  nombre_completo: '',
  celular: '',
  correo: '',
  ciudad: '',

  // 02 PERFIL OCUPACIONAL
  situacion_ocupacional: '',
  area_interes: '',
  centro_estudios: '',
  empresa_emprendimiento: '',
  numero_trabajadores: '',

  // 03 CURSO Y HORARIO (Multi-curso)
  cursos_seleccionados: [], // Array of { id_clase, id_curso, nombre_curso, precio, horario_label }

  // 04 INTERÉS EN CAPACITACIÓN
  nivel_conocimiento: '',
  objetivo_curso: '',

  // 05 INFORMACIÓN Y AUTORIZACIONES
  origen_contacto: '',
  acepta_privacidad: false,
  acepta_marketing: false,
};

const INITIAL_ESTADOS = {
  cargandoCursos: true,
  cargandoHorarios: false,
  enviando: false,
  errorCursos: null,
  errorHorarios: null,
  errorEnvio: null,
  enviado: false,
  procesandoPago: false,
  errorPago: null,
  pagoCompletado: false,
  fase: 'formulario', // 'formulario' | 'checkout' | 'exito'
};

/* ============================================================================
 * HOOK PRINCIPAL: useFormInscripcion
 * ============================================================================ */
export function useFormInscripcion() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [estadosDeCarga, setEstados] = useState(INITIAL_ESTADOS);

  // Cursos únicos construidos desde vista_clases_disponibles y tabla cursos
  const [cursos, setCursos] = useState([]);

  // Todas las clases/filas de vista_clases_disponibles (cruda para filtrar horarios)
  const [_clasesRaw, setClasesRaw] = useState([]);

  // Todos los registros de sesiones_horarios
  const [_sesionesRaw, setSesionesRaw] = useState([]);

  // Horarios filtrados para el curso seleccionado (retrocompatibilidad)
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  // Multi-curso: acordeón y caché de horarios por curso
  const [cursoExpandido, setCursoExpandido] = useState(null); // id_curso actualmente expandido
  const [horariosPorCurso, setHorariosPorCurso] = useState({}); // { [id_curso]: horariosDisponibles[] }

  // Registro confirmado al enviar la preinscripción
  const [datosRegistrados, setDatosRegistrados] = useState(null);

  /* --------------------------------------------------------------------------
   * CARGA INICIAL: vista_clases_disponibles + sesiones_horarios + cursos
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const cargarDatos = async () => {
      setEstados((prev) => ({
        ...prev,
        cargandoCursos: true,
        errorCursos: null,
      }));

      try {
        // Fetch paralelo: vista, sesiones, catálogo de cursos (precios) y clases asignadas (código de clase)
        const [
          { data: clasesData, error: clasesError },
          { data: sesionesData, error: sesionesError },
          { data: cursosData, error: cursosError },
          { data: clasesAsignadasData, error: clasesAsignadasError },
        ] = await Promise.all([
          supabase.from('vista_clases_disponibles').select('*'),
          supabase.from('sesiones_horarios').select('*'),
          supabase.from('cursos').select('*'),
          supabase.from('clases_asignadas').select('id_clase, id_curso, codigo_clase'),
        ]);

        if (cancelled) return;

        if (clasesError) throw clasesError;
        if (sesionesError) throw sesionesError;
        if (cursosError) console.warn('[useFormInscripcion] Aviso al cargar cursos:', cursosError.message);
        if (clasesAsignadasError) console.warn('[useFormInscripcion] Aviso al cargar clases_asignadas:', clasesAsignadasError.message);

        // Mapa de código de clase por id_clase
        const codigoClaseMap = new Map();
        (clasesAsignadasData || []).forEach((ca) => {
          if (ca.id_clase) {
            codigoClaseMap.set(Number(ca.id_clase), ca.codigo_clase);
          }
        });

        // Enriquecer clasesData con su respectivo codigo_clase
        const clasesConCodigo = (clasesData || []).map((c) => ({
          ...c,
          codigo_clase: codigoClaseMap.get(Number(c.id_clase)) || c.codigo_clase || `CLS-${c.id_clase}`,
        }));

        setClasesRaw(clasesConCodigo);
        setSesionesRaw(sesionesData || []);

        // Mapa de precios por id_curso
        const cursosDbMap = new Map();
        (cursosData || []).forEach((c) => {
          cursosDbMap.set(c.id_curso, {
            precio: (c.precio !== null && c.precio !== undefined && !isNaN(Number(c.precio))) ? Number(c.precio) : 0,
            codigo_curso: c.codigo_curso || '',
          });
        });

        // Construir lista de cursos únicos agrupando por id_curso
        const cursosMap = new Map();
        (clasesData || []).forEach((fila) => {
          if (!cursosMap.has(fila.id_curso)) {
            const dbInfo = cursosDbMap.get(fila.id_curso) || { precio: 0, codigo_curso: '' };
            cursosMap.set(fila.id_curso, {
              id_curso: fila.id_curso,
              nombre_curso: fila.nombre_curso,
              precio: dbInfo.precio,
              codigo_curso: dbInfo.codigo_curso,
              vacantes_totales: 0,
            });
          }
          const entry = cursosMap.get(fila.id_curso);
          entry.vacantes_totales += fila.vacantes_disponibles ?? 0;
        });

        const cursosFinales = Array.from(cursosMap.values()).map((c) => ({
          ...c,
          isDisabled: c.vacantes_totales <= 0,
          label: c.vacantes_totales <= 0
            ? `${c.nombre_curso} (Agotado / Próximamente)`
            : c.nombre_curso,
        }));

        setCursos(cursosFinales);
      } catch (err) {
        if (!cancelled) {
          console.error('[useFormInscripcion] Error al cargar cursos:', err);
          setEstados((prev) => ({
            ...prev,
            errorCursos: 'No se pudieron cargar los cursos disponibles. Intenta recargar la página.',
          }));
        }
      } finally {
        if (!cancelled) {
          setEstados((prev) => ({ ...prev, cargandoCursos: false }));
        }
      }
    };

    cargarDatos();
    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------------------------------------------------------------------
   * MENSAJES DE ESTADO VACÍO
   * -------------------------------------------------------------------------- */
  const mensajeVacioCursos = useMemo(() => {
    if (estadosDeCarga.cargandoCursos) return null;
    if (cursos.length === 0) return 'Aún no hay cursos disponibles.';
    return null;
  }, [cursos, estadosDeCarga.cargandoCursos]);

  const mensajeVacioHorarios = useMemo(() => {
    if (horariosDisponibles.length === 0 && formData._cursoCargado) {
      return 'No hay horarios disponibles para este curso.';
    }
    return null;
  }, [horariosDisponibles, formData._cursoCargado]);

  /* --------------------------------------------------------------------------
   * LÓGICA DE CARGA Y SELECCIÓN MULTI-CURSO
   * -------------------------------------------------------------------------- */

  // Función interna para reutilizar la lógica de carga y formateo de horarios por curso
  const _cargarHorariosDeCurso = useCallback(
    (id_curso) => {
      if (!id_curso) return [];
      const clasesUnicasMap = new Map();
      _clasesRaw.forEach((c) => {
        if (String(c.id_curso) === String(id_curso) && !clasesUnicasMap.has(c.id_clase)) {
          clasesUnicasMap.set(c.id_clase, c);
        }
      });
      const clasesDelCurso = Array.from(clasesUnicasMap.values());

      const opcionesClases = clasesDelCurso
        .map((clase) => {
          const sesionesDeEstaClase = _sesionesRaw
            .filter((s) => String(s.id_clase) === String(clase.id_clase))
            .sort((a, b) => {
              if ((a.fecha_clase || '') < (b.fecha_clase || '')) return -1;
              if ((a.fecha_clase || '') > (b.fecha_clase || '')) return 1;
              return (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
            });
          const vacantes = clase.vacantes_totales ?? clase.vacantes_disponibles ?? 0;
          const primeraFecha = clase.fecha_inicio || sesionesDeEstaClase[0]?.fecha_clase || '';
          return {
            id_clase: clase.id_clase,
            id_sesion: clase.id_clase,
            label: formatearHorariosClase(clase, sesionesDeEstaClase),
            vacantes_disponibles: vacantes,
            isAgotado: vacantes <= 0,
            _primeraFecha: primeraFecha,
            codigo_clase: clase.codigo_clase || `CLS-${clase.id_clase}`,
          };
        })
        .sort((a, b) => (a._primeraFecha || '').localeCompare(b._primeraFecha || ''));

      return opcionesClases;
    },
    [_clasesRaw, _sesionesRaw]
  );

  // Expandir/colapsar un curso. Carga sus horarios si no los tenía.
  const toggleCurso = useCallback(
    (id_curso) => {
      setCursoExpandido((prev) => {
        const nuevo = prev === id_curso ? null : id_curso;
        if (nuevo && !horariosPorCurso[nuevo]) {
          const horarios = _cargarHorariosDeCurso(nuevo);
          setHorariosPorCurso((p) => ({ ...p, [nuevo]: horarios }));
        }
        return nuevo;
      });
    },
    [horariosPorCurso, _cargarHorariosDeCurso]
  );

  // Seleccionar un horario (clase) para un curso. Reemplaza si ya tenía uno.
  const seleccionarHorario = useCallback(
    (id_clase, id_curso) => {
      const cursoInfo = cursos.find((c) => String(c.id_curso) === String(id_curso));
      const horarios = horariosPorCurso[id_curso] || _cargarHorariosDeCurso(id_curso);
      const horarioInfo = horarios.find((h) => String(h.id_clase) === String(id_clase));
      if (!cursoInfo || !horarioInfo) return;

      setFormData((prev) => {
        const prevSeleccionados = prev.cursos_seleccionados.filter(
          (cs) => String(cs.id_curso) !== String(id_curso)
        );
        return {
          ...prev,
          cursos_seleccionados: [
            ...prevSeleccionados,
            {
              id_clase: Number(id_clase),
              id_curso: Number(id_curso),
              nombre_curso: cursoInfo.nombre_curso,
              precio: cursoInfo.precio,
              horario_label: horarioInfo.label,
              codigo_clase: horarioInfo.codigo_clase || `CLS-${id_clase}`,
            },
          ],
        };
      });
    },
    [cursos, horariosPorCurso, _cargarHorariosDeCurso]
  );

  // Deseleccionar un curso completo
  const deseleccionarCurso = useCallback((id_curso) => {
    setFormData((prev) => ({
      ...prev,
      cursos_seleccionados: prev.cursos_seleccionados.filter(
        (cs) => String(cs.id_curso) !== String(id_curso)
      ),
    }));
  }, []);

  // Mantener seleccionarCurso por retrocompatibilidad
  const seleccionarCurso = useCallback(
    (id_curso) => {
      if (!id_curso) {
        setHorariosDisponibles([]);
        return;
      }
      const opciones = _cargarHorariosDeCurso(id_curso);
      setHorariosDisponibles(opciones);
    },
    [_cargarHorariosDeCurso]
  );

  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      if (name === 'situacion_ocupacional') {
        const nuevaSituacion = finalValue;
        let camposLimpios = {};

        if (nuevaSituacion === 'Trabajador dependiente (Planilla)') {
          camposLimpios = {
            centro_estudios: '',
            numero_trabajadores: '',
          };
        } else if (nuevaSituacion === 'Empresario / Dueño de negocio / MYPE') {
          camposLimpios = {
            centro_estudios: '',
          };
        } else if (nuevaSituacion === 'Estudiante o egresado') {
          camposLimpios = {
            empresa_emprendimiento: '',
            numero_trabajadores: '',
          };
        } else {
          // 'Trabajador independiente / Honorarios', 'En búsqueda de empleo / Transición laboral', vacía u otra
          camposLimpios = {
            centro_estudios: '',
            empresa_emprendimiento: '',
            numero_trabajadores: '',
          };
        }

        return {
          ...prev,
          situacion_ocupacional: nuevaSituacion,
          ...camposLimpios,
        };
      }

      return { ...prev, [name]: finalValue };
    });
  }, []);

  /* --------------------------------------------------------------------------
   * enviarFormulario: Registro atómico mediante RPC Stored Procedure Multi-Curso
   * -------------------------------------------------------------------------- */
  const enviarFormulario = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      setEstados((prev) => ({ ...prev, enviando: true, errorEnvio: null }));

      try {
        const cursosAInscribir = formData.cursos_seleccionados;
        if (!cursosAInscribir || cursosAInscribir.length === 0) {
          throw new Error('Debes seleccionar al menos un curso con horario.');
        }

        // Lógica condicional para perfil profesional (igual que antes)
        const centroEstudiosFinal =
          formData.situacion_ocupacional === 'Estudiante o egresado'
            ? formData.centro_estudios?.trim() || null
            : null;
        const empresaFinal =
          formData.situacion_ocupacional === 'Trabajador dependiente (Planilla)' ||
          formData.situacion_ocupacional === 'Empresario / Dueño de negocio / MYPE'
            ? formData.empresa_emprendimiento?.trim() || null
            : null;
        const numTrabajadoresFinal =
          formData.situacion_ocupacional === 'Empresario / Dueño de negocio / MYPE'
            ? formData.numero_trabajadores || null
            : null;

        // Llamar al RPC una vez por cada curso seleccionado (secuencial)
        const registros = [];
        for (const cursoSel of cursosAInscribir) {
          const rpcParams = {
            p_nombre_completo: formData.nombre_completo?.trim(),
            p_celular: formData.celular?.trim(),
            p_correo: formData.correo?.trim().toLowerCase(),
            p_ciudad: formData.ciudad?.trim() || null,
            p_situacion_ocupacional: formData.situacion_ocupacional || null,
            p_area_interes: formData.area_interes?.trim() || null,
            p_centro_estudios: centroEstudiosFinal,
            p_empresa_emprendimiento: empresaFinal,
            p_numero_trabajadores: numTrabajadoresFinal,
            p_id_clase: Number(cursoSel.id_clase),
            p_nivel_conocimiento: formData.nivel_conocimiento || null,
            p_objetivo_curso: formData.objetivo_curso?.trim() || null,
            p_origen_contacto: formData.origen_contacto || null,
            p_acepta_privacidad: Boolean(formData.acepta_privacidad),
            p_acepta_marketing: Boolean(formData.acepta_marketing),
          };

          const { data, error } = await supabase.rpc('registrar_preinscripcion_completa', rpcParams);

          if (error) {
            throw new Error(error.message || 'Error de conexión con la base de datos.');
          }

          // Normalizar en caso venga serializado como string JSON o array
          let resData = data;
          if (typeof resData === 'string') {
            try {
              resData = JSON.parse(resData);
            } catch {}
          }
          if (Array.isArray(resData)) {
            resData = resData[0];
          }

          // 1. Interceptar la respuesta de negocio:
          // Si la BD devuelve success: false (ej: ALREADY_REGISTERED), detener de inmediato
          if (resData && (resData.success === false || resData.success === 'false')) {
            // 1. Apagar el estado de carga
            setEstados((prev) => ({
              ...prev,
              enviando: false,
              errorEnvio: resData.mensaje || resData.message || 'Este correo ya cuenta con una vacante pagada para esta clase.',
            }));

            // 2. Mostrar la alerta visual con el mensaje que manda la BD
            toast.error(resData.mensaje || resData.message || 'Este correo ya está registrado.');

            // 3. DETENER LA EJECUCIÓN AQUÍ MISMO (return temprano)
            return {
              success: false,
              error: resData.error || 'ALREADY_REGISTERED',
              mensaje: resData.mensaje || 'Este correo ya está registrado.',
            };
          }

          // 2. Proteger el flujo de pago:
          // Únicamente continuar si la respuesta confirma explícitamente success === true
          if (!resData || (resData.success !== true && resData.success !== 'true') || !resData.id_preinscripcion) {
            const errorMsg = resData?.mensaje || resData?.message || 'No se pudo registrar la preinscripción en el servidor.';
            setEstados((prev) => ({
              ...prev,
              enviando: false,
              errorEnvio: errorMsg,
            }));
            toast.error(errorMsg);
            return { success: false, error: 'INVALID_RESPONSE', mensaje: errorMsg };
          }

          // Si la preinscripción fue reanudada (carrito recuperado)
          if (resData.estado === 'Reanudado') {
            toast.info('Preinscripción recuperada', {
              description: 'Retomando tu reserva pendiente para completar el pago.',
              duration: 4000,
            });
          }

          const claseInfo = _clasesRaw.find((c) => String(c.id_clase) === String(cursoSel.id_clase));
          const codigoClaseFinal = cursoSel.codigo_clase || claseInfo?.codigo_clase || `CLS-${cursoSel.id_clase}`;

          registros.push({
            id_preinscripcion: resData.id_preinscripcion,
            id_persona: resData.id_persona,
            id_clase: cursoSel.id_clase,
            id_curso: cursoSel.id_curso,
            nombre_curso: cursoSel.nombre_curso,
            precio: cursoSel.precio,
            horario_label: cursoSel.horario_label,
            codigo_clase: codigoClaseFinal,
          });
        }

        // Si no hay registros exitosos, abortar y apagar loading
        if (!registros || registros.length === 0) {
          setEstados((prev) => ({ ...prev, enviando: false }));
          return { success: false };
        }

        // 3. Flujo protegido hacia la pasarela de pagos (solo si data.success === true)

        // Guardar todos los id_preinscripcion en localStorage (separados por coma si son varios)
        const todosLosIds = registros.map((r) => r.id_preinscripcion);
        const idsCadena = todosLosIds.join(',');

        // Monto total
        const montoTotal = registros.reduce((sum, r) => sum + Number(r.precio || 0), 0);
        const tituloResumen = registros.length === 1
          ? registros[0].nombre_curso
          : `${registros.length} Cursos JB Impulsa`;

        // Crear pago pendiente para todas las preinscripciones (el checkout agrupa todo).
        // SEGURIDAD: Solo el backend puede crear/actualizar pagos. Si no responde, se advierte
        // en consola pero NO se bloquea el flujo de preinscripción (el pago se creará al hacer clic en Pagar).
        let idPagoInicial = null;
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
          const resInicio = await fetch(`${backendUrl}/api/pagos/iniciar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_preinscripcion: idsCadena,
              ids_preinscripciones: todosLosIds,
              monto: montoTotal,
              titulo: tituloResumen,
            }),
          });
          if (resInicio.ok) {
            const dataInicio = await resInicio.json();
            idPagoInicial = dataInicio?.id_pago;
          } else {
            console.warn('[useFormInscripcion] Backend no pudo registrar el pago pendiente inicial. Se reintentará al presionar Pagar.');
          }
        } catch (pagoErr) {
          console.warn('[useFormInscripcion] Backend no disponible para registrar pago pendiente inicial:', pagoErr.message);
        }

        const primerRegistro = registros[0];

        // Datos confirmados para la pantalla de checkout
        const datosConfirmados = {
          id_preinscripcion: primerRegistro.id_preinscripcion,
          ids_preinscripciones: todosLosIds,
          id_persona: primerRegistro.id_persona,
          id_pago: idPagoInicial,
          id_clase: primerRegistro.id_clase,
          codigo_clase: primerRegistro.codigo_clase,
          nombre_completo: formData.nombre_completo?.trim(),
          correo: formData.correo?.trim().toLowerCase(),
          celular: formData.celular?.trim(),
          ciudad: formData.ciudad?.trim() || null,
          situacion_ocupacional: formData.situacion_ocupacional,
          area_interes: formData.area_interes?.trim() || null,
          centro_estudios: centroEstudiosFinal,
          empresa_emprendimiento: empresaFinal,
          numero_trabajadores: numTrabajadoresFinal,
          nivel_conocimiento: formData.nivel_conocimiento,
          objetivo_curso: formData.objetivo_curso?.trim() || null,
          origen_contacto: formData.origen_contacto,
          acepta_privacidad: formData.acepta_privacidad,
          acepta_marketing: formData.acepta_marketing,
          // Multi-curso
          cursos_registrados: registros,
          nombre_curso: tituloResumen,
          precio: montoTotal,
          estado_inscripcion: 'preinscrito',
          estado_pago: 'pendiente',
        };

        // Persistir en localStorage para recuperar datos exactos al volver de Mercado Pago
        try {
          localStorage.setItem('inscripcion_pendiente_id', idsCadena);
          localStorage.setItem('inscripcion_pendiente_monto', String(montoTotal));
          localStorage.setItem('inscripcion_pendiente_datos', JSON.stringify(datosConfirmados));
        } catch {}

        setDatosRegistrados(datosConfirmados);
        setEstados((prev) => ({ ...prev, enviando: false, enviado: true, fase: 'checkout' }));
        return { success: true, id_preinscripcion: primerRegistro.id_preinscripcion, ids_preinscripciones: todosLosIds };
      } catch (err) {
        console.error('[useFormInscripcion] Error al enviar formulario (RPC multi-curso):', err);
        setEstados((prev) => ({
          ...prev,
          enviando: false,
          errorEnvio: err.message || 'Ocurrió un error inesperado al procesar la inscripción.',
        }));
        return { success: false, error: err.message };
      }
    },
    [formData, cursos, _clasesRaw]
  );

  /* --------------------------------------------------------------------------
   * confirmarPagoExitoso:
   * BLINDAJE DE SEGURIDAD:
   * La confirmación de pago está estrictamente restringida al retorno oficial
   * de Mercado Pago verificado mediante parámetros de URL ('pago === aprobado'
   * o 'status === approved' / 'collection_status === approved').
   * Se bloquea y rechaza cualquier intento de confirmación simulada o ficticia
   * desde el cliente.
   * Toda actualización en la BD pasa EXCLUSIVAMENTE por el backend vía SERVICE_ROLE_KEY.
   * -------------------------------------------------------------------------- */
  const confirmarPagoExitoso = useCallback(
    async ({
      numero_operacion,
      metodo_pago = 'mercadopago',
      id_preinscripcion: idProp,
      ids_preinscripciones: idsProp,
      esRetornoOficial = false,
    } = {}) => {
      // 1. Verificación estricta de legitimidad: solo retorno oficial de pasarela
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const esRetornoLegitimo =
        esRetornoOficial ||
        Boolean(
          urlParams &&
          (urlParams.get('pago') === 'aprobado' ||
           urlParams.get('status') === 'approved' ||
           urlParams.get('collection_status') === 'approved')
        );

      if (!esRetornoLegitimo) {
        console.warn(
          '[useFormInscripcion] SEGURIDAD: Invocación de confirmación de pago rechazada. No proviene del retorno legítimo de Mercado Pago.'
        );
        return false;
      }

      // Recuperar datos previos en caso de recarga tras redirección de pasarela
      let datosPrevios = datosRegistrados;
      if (!datosPrevios && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('inscripcion_pendiente_datos');
          if (raw) datosPrevios = JSON.parse(raw);
        } catch {}
      }

      // Recopilar lista completa de IDs (array de números) para admitir inscripciones multi-curso
      let idsAConfirmar = [];

      if (Array.isArray(idsProp) && idsProp.length > 0) {
        idsAConfirmar = idsProp.map(Number).filter((n) => !isNaN(n) && n > 0);
      } else if (
        Array.isArray(datosRegistrados?.ids_preinscripciones) &&
        datosRegistrados.ids_preinscripciones.length > 0
      ) {
        idsAConfirmar = datosRegistrados.ids_preinscripciones
          .map(Number)
          .filter((n) => !isNaN(n) && n > 0);
      } else if (
        Array.isArray(datosPrevios?.ids_preinscripciones) &&
        datosPrevios.ids_preinscripciones.length > 0
      ) {
        idsAConfirmar = datosPrevios.ids_preinscripciones
          .map(Number)
          .filter((n) => !isNaN(n) && n > 0);
      } else if (idProp) {
        if (typeof idProp === 'string' && idProp.includes(',')) {
          idsAConfirmar = idProp
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);
        } else if (Array.isArray(idProp)) {
          idsAConfirmar = idProp.map(Number).filter((n) => !isNaN(n) && n > 0);
        } else {
          const num = Number(idProp);
          if (!isNaN(num) && num > 0) idsAConfirmar = [num];
        }
      } else if (datosRegistrados?.id_preinscripcion || datosPrevios?.id_preinscripcion) {
        const str = String(datosRegistrados?.id_preinscripcion || datosPrevios?.id_preinscripcion);
        if (str.includes(',')) {
          idsAConfirmar = str
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);
        } else {
          const num = Number(str);
          if (!isNaN(num) && num > 0) idsAConfirmar = [num];
        }
      } else {
        const stored =
          typeof window !== 'undefined'
            ? localStorage.getItem('inscripcion_pendiente_id')
            : null;
        if (stored) {
          idsAConfirmar = stored
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);
        }
      }

      if (!idsAConfirmar || idsAConfirmar.length === 0) {
        console.warn('[useFormInscripcion] No se encontró id_preinscripcion para confirmar el pago.');
        setEstados((prev) => ({
          ...prev,
          errorPago: 'No se encontró el ID de preinscripción. Contacta al equipo de soporte.',
        }));
        return false;
      }

      const idClase = datosRegistrados?.id_clase || datosPrevios?.id_clase;
      const paymentIdFromUrl = urlParams
        ? (urlParams.get('payment_id') || urlParams.get('collection_id') || urlParams.get('preference_id'))
        : null;
      const numOp = numero_operacion || paymentIdFromUrl || `MP-${Date.now()}`;

      // Resolver monto real sin forzar nunca un default de 100
      const storedMonto = typeof window !== 'undefined' ? localStorage.getItem('inscripcion_pendiente_monto') : null;
      let montoFinal = undefined;
      if (datosRegistrados?.precio !== undefined && datosRegistrados?.precio !== null) {
        montoFinal = Number(datosRegistrados.precio);
      } else if (datosPrevios?.precio !== undefined && datosPrevios?.precio !== null) {
        montoFinal = Number(datosPrevios.precio);
      } else if (storedMonto !== null && !isNaN(Number(storedMonto))) {
        montoFinal = Number(storedMonto);
      }

      const idsCadena = idsAConfirmar.join(',');

      setEstados((prev) => ({ ...prev, procesandoPago: true, errorPago: null }));

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

        // Única vía: el backend confirma el pago con la SERVICE_ROLE_KEY (nunca el frontend)
        const res = await fetch(`${backendUrl}/api/pagos/confirmar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_preinscripcion: idsCadena,
            ids_preinscripciones: idsAConfirmar,
            id_clase: idClase ? Number(idClase) : undefined,
            numero_operacion: numOp,
            metodo_pago: metodo_pago,
            monto: montoFinal,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData?.message ||
            `El servidor respondió con error ${res.status}. Contacta al equipo de soporte con tu código JBI-${idsCadena}.`
          );
        }

        const data = await res.json();
        console.log('[useFormInscripcion] Confirmación exitosa en backend:', data);

        // Actualizar estado local a 'inscrito' y 'pagado'
        setDatosRegistrados((prev) => {
          const base = prev || datosPrevios || {};
          const prevCursos = base?.cursos_registrados || [];
          const precioConfirmado = data?.detalle?.precio !== undefined && data?.detalle?.precio !== null
            ? Number(data.detalle.precio)
            : (montoFinal !== undefined ? montoFinal : Number(base?.precio || 0));

          return {
            ...base,
            id_preinscripcion: idsAConfirmar[0],
            ids_preinscripciones: idsAConfirmar,
            estado_inscripcion: 'inscrito',
            estado_pago: 'pagado',
            numero_operacion: numOp,
            ...(data?.detalle || {}),
            precio: precioConfirmado,
            codigo_clase: data?.detalle?.codigo_clase || base?.codigo_clase || (idClase ? `CLS-${idClase}` : null),
            cursos_registrados: prevCursos.length > 0 ? prevCursos : (data?.detalle?.cursos_confirmados || []),
          };
        });

        setEstados((prev) => ({
          ...prev,
          procesandoPago: false,
          pagoCompletado: true,
          fase: 'exito',
        }));

        return true;
      } catch (err) {
        console.error('[useFormInscripcion] Error en confirmación de pago:', err);
        setEstados((prev) => ({
          ...prev,
          procesandoPago: false,
          errorPago:
            err.message ||
            'No se pudo confirmar el pago. El servidor no está disponible. Por favor contacta al equipo de soporte.',
        }));
        return false;
      }
    },
    [datosRegistrados]
  );

  /* --------------------------------------------------------------------------
   * Detección de retorno desde Mercado Pago tras redirección
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const pago = params.get('pago');
    const status = params.get('status') || params.get('collection_status');
    const ref =
      params.get('ref') ||
      params.get('external_reference') ||
      localStorage.getItem('inscripcion_pendiente_id');
    const paymentId =
      params.get('payment_id') ||
      params.get('collection_id') ||
      params.get('preference_id');

    if ((pago === 'aprobado' || status === 'approved') && ref) {
      console.log('[useFormInscripcion] Retorno legítimo de Mercado Pago detectado para ref:', ref);
      confirmarPagoExitoso({
        id_preinscripcion: ref,
        numero_operacion: paymentId ? String(paymentId) : undefined,
        metodo_pago: 'mercadopago',
        esRetornoOficial: true,
      });

      // Limpiar query params de la URL sin recargar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [confirmarPagoExitoso]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setHorariosDisponibles([]);
    setCursoExpandido(null);
    setHorariosPorCurso({});
    setDatosRegistrados(null);
    setEstados((prev) => ({
      ...prev,
      enviando: false,
      enviado: false,
      procesandoPago: false,
      errorPago: null,
      pagoCompletado: false,
      errorEnvio: null,
      fase: 'formulario',
    }));
  }, []);

  return {
    // Estado del formulario
    formData,
    handleChange,

    // Datos de Supabase
    cursos,
    horariosDisponibles,
    seleccionarCurso,

    // Multi-curso y Horarios por Curso
    cursoExpandido,
    toggleCurso,
    horariosPorCurso,
    seleccionarHorario,
    deseleccionarCurso,

    // Envío y Estado del Formulario
    enviarFormulario,
    resetForm,

    // Estados de carga / error / fases
    estadosDeCarga,
    fase: estadosDeCarga.fase,
    isSubmitted: estadosDeCarga.enviado,
    isSubmitting: estadosDeCarga.enviando,

    // Mensajes de estado vacío
    mensajeVacioCursos,
    mensajeVacioHorarios,

    // Datos del registro confirmado
    datosRegistrados,
  };
}

export { formatearHorariosClase };
export default useFormInscripcion;
