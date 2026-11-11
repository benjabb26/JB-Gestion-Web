/**
 * @fileoverview Barrel export para el dominio curso_disponibles en CursosPage.
 * Expone la configuración de temarios, el custom hook y los componentes visuales.
 */

export * from './data/temariosConfig';
export * from './hooks/useCursosDisponibles';
export { default as useCursosDisponibles } from './hooks/useCursosDisponibles';
export * from './components/CursosDisponiblesSection';
export { default as CursosDisponiblesSection } from './components/CursosDisponiblesSection';
