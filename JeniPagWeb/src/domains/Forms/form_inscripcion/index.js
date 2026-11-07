/**
 * @fileoverview Barrel export para el dominio form_inscripcion.
 * Expone componentes visuales, páginas, hooks, modelos de datos, constantes y validaciones.
 */

export * from './data/cursoInscripcionData';
export * from './utils/formatearHorarios';
export * from './hooks/useFormInscripcion';
export { default as useFormInscripcion } from './hooks/useFormInscripcion';

export { FormInscripcion, default as FormInscripcionComponent } from './components/FormInscripcion';
export { FormInscripcionPage, default as FormInscripcionPageDefault } from './FormInscripcionPage';
