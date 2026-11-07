/**
 * @fileoverview Constantes y datos de configuración para la preinscripción
 * al curso "JB Impulsa: Sistemas Pensionarios en el Perú · AFP, ONP y AFPnet".
 * Flujo de preinscripción sin cobros ni pasarelas de pago.
 */

/**
 * Información principal y metadatos del curso de pensiones.
 */
export const CURSO_PENSIONES = {
  id: 'JBI-AFP-001',
  code: 'JBI-AFP-001',
  title: 'Sistemas Pensionarios en el Perú · AFP, ONP y AFPnet',
  subtitle: 'Capacitación práctica y actualización laboral',
  category: 'Laboral y Planillas',
  dates: '16, 18, 20 y 23 de Noviembre 2026',
  schedule: '8:00 p. m. a 10:00 p. m. (Hora Perú)',
  modality: 'Virtual en vivo (Google Meet / Zoom)',
  sessions: 4,
  durationHours: '8 horas académicas en vivo',
  maxCapacity: 30,
  certificate: 'Constancia Digital de Participación',
  targetAudience: 'Trabajadores dependientes, empresarios, emprendedores, estudiantes y profesionales afines',
  highlights: [
    'Enfoque 100% práctico con análisis de casos reales',
    'Simulación en plataforma AFPnet paso a paso',
    'Diferenciación técnica y laboral: AFP vs. ONP',
    'Plantillas de liquidación y planillas en Excel incluidas',
    'Acceso a grabaciones por 30 días posteriores al curso',
    'Constancia Digital de Participación verificable'
  ]
};

/**
 * Configuración dinámica de perfiles ocupacionales y sus campos condicionales.
 * Permite al Frontend renderizar únicamente los campos pertinentes según la situación seleccionada.
 */
export const PERFILES_OCUPACIONALES_CONFIG = {
  'Trabajador dependiente (Planilla)': {
    label: 'Trabajador dependiente (Planilla)',
    description: 'Para profesionales laborando en planilla en sector público o privado.',
    fields: [
      {
        name: 'empresa',
        label: 'Empresa o institución donde laboras',
        placeholder: 'Ej. Corporación Textil S.A.C. / Min. de Trabajo',
        required: true,
        errorMessage: 'Ingresa la empresa o institución donde laboras actualmente.'
      },
      {
        name: 'cargo',
        label: 'Cargo o puesto actual',
        placeholder: 'Ej. Asistente de Planillas / Analista de RRHH / Contador',
        required: true,
        errorMessage: 'Ingresa tu cargo o función en la empresa.'
      }
    ]
  },
  'Trabajador independiente / Honorarios': {
    label: 'Trabajador independiente / Honorarios',
    description: 'Para consultores, asesores y profesionales independientes.',
    fields: [
      {
        name: 'profesion',
        label: 'Profesión, oficio o área de especialidad',
        placeholder: 'Ej. Contador público colegiado / Consultor tributario',
        required: true,
        errorMessage: 'Ingresa tu profesión, oficio o área de especialidad.'
      }
    ]
  },
  'Empresario / Dueño de negocio / MYPE': {
    label: 'Empresario / Dueño de negocio / MYPE',
    description: 'Para personas naturales o jurídicas con negocio propio.',
    fields: [
      {
        name: 'empresa',
        label: 'Nombre de tu empresa o negocio / marca',
        placeholder: 'Ej. Comercial San Pedro / JB Consultores',
        required: true,
        errorMessage: 'Ingresa el nombre comercial o razón social de tu empresa/negocio.'
      },
      {
        name: 'rubro',
        label: 'Rubro o actividad comercial',
        placeholder: 'Ej. Servicios contables, Retail, Gastronomía, Construcción',
        required: true,
        errorMessage: 'Indica el rubro o actividad de tu empresa.'
      }
    ]
  },
  'Estudiante o egresado': {
    label: 'Estudiante o egresado',
    description: 'Para estudiantes universitarios, de instituto o egresados recientes.',
    fields: [
      {
        name: 'centroEstudios',
        label: 'Universidad o Instituto',
        placeholder: 'Ej. UNMSM, PUCP, Zegel IPAE, Certus',
        required: true,
        errorMessage: 'Ingresa el nombre de tu universidad o instituto.'
      },
      {
        name: 'carrera',
        label: 'Carrera profesional o especialidad',
        placeholder: 'Ej. Contabilidad y Finanzas / Administración / Derecho',
        required: true,
        errorMessage: 'Ingresa tu carrera profesional o especialidad de estudio.'
      }
    ]
  },
  'En búsqueda de empleo / Transición laboral': {
    label: 'En búsqueda de empleo / Transición laboral',
    description: 'Para quienes buscan actualizar conocimientos para postular a nuevas vacantes.',
    fields: [
      {
        name: 'areaInteres',
        label: 'Área profesional o de interés laboral',
        placeholder: 'Ej. Planillas y nóminas, Gestión de talento humano, Administración',
        required: true,
        errorMessage: 'Indica tu área profesional o de interés laboral.'
      }
    ]
  },
  'Otro': {
    label: 'Otro',
    description: 'Otras actividades o situaciones particulares.',
    fields: [
      {
        name: 'detalleOtro',
        label: 'Describe brevemente tu ocupación o actividad',
        placeholder: 'Ej. Asesor independiente retirado, voluntario, investigador',
        required: true,
        errorMessage: 'Por favor, describe brevemente tu ocupación actual o actividad.'
      }
    ]
  }
};

/**
 * Lista de opciones de situaciones ocupacionales derivadas de la configuración.
 */
export const SITUACION_OCUPACIONAL_OPTIONS = Object.keys(PERFILES_OCUPACIONALES_CONFIG);

/**
 * Nombres de todos los campos condicionales ocupacionales.
 * Útil para resetear o auditar formularios dinámicos.
 */
export const ALL_OCUPATIONAL_CONDITIONAL_FIELDS = [
  'empresa',
  'cargo',
  'profesion',
  'rubro',
  'centroEstudios',
  'carrera',
  'areaInteres',
  'detalleOtro'
];

/**
 * Opciones para el nivel de conocimiento previo del participante.
 */
export const NIVEL_CONOCIMIENTO_OPTIONS = [
  'Principiante / desde cero',
  'Intermedio (conozco conceptos básicos)',
  'Avanzado (experiencia en planillas y AFPnet)'
];

/**
 * Opciones de procedencia / canal de difusión.
 */
export const COMO_CONOCISTE_OPTIONS = [
  'Facebook',
  'Instagram',
  'TikTok',
  'LinkedIn',
  'Recomendación de colega o amigo',
  'Página Web',
  'Otro'
];

/**
 * Lista de departamentos del Perú y opción para participantes internacionales.
 */
export const DEPARTAMENTOS_PERU = [
  'Lima Metropolitana',
  'Lima Provincias',
  'Callao',
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
  'Extranjero / Otro'
];

/**
 * Datos oficiales de contacto institucional y coordinación académica.
 */
export const CONTACTO_INSTITUCIONAL = {
  institucion: 'JB Gestión & Capital Humano E.I.R.L.',
  telefonoWhatsApp: '+51 920 862 919',
  whatsappRaw: '51920862919',
  email: 'contacto@jbgestion.com',
  horarioAtencion: 'Lunes a Viernes de 9:00 a. m. a 6:00 p. m.'
};

/**
 * Claves de almacenamiento local (localStorage).
 */
export const STORAGE_KEYS = {
  PREINSCRIPCIONES: 'jb_preinscripciones'
};

// Aliases para compatibilidad con nomenclatura directa del Frontend
export const cursoInscripcionData = CURSO_PENSIONES;
export const cursoData = CURSO_PENSIONES;
export const situacionOcupacionalOptions = SITUACION_OCUPACIONAL_OPTIONS;
export const perfilesOcupacionalesConfig = PERFILES_OCUPACIONALES_CONFIG;
export const nivelConocimientoOptions = NIVEL_CONOCIMIENTO_OPTIONS;
export const comoConocisteOptions = COMO_CONOCISTE_OPTIONS;
export const departamentosPeru = DEPARTAMENTOS_PERU;
export const contactoInstitucional = CONTACTO_INSTITUCIONAL;

export default CURSO_PENSIONES;
