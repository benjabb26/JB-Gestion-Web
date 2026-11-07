import { useState, useCallback } from 'react';

/**
 * Custom hook para procesar pagos e interactuar con el backend de Mercado Pago.
 *
 * Realiza una petición POST a la ruta `${import.meta.env.VITE_BACKEND_URL}/api/pagos/mercadopago`
 * con los datos del producto (title, quantity, price, id_preinscripcion) y retorna
 * tanto el preferenceId como las URLs de redirección oficial (init_point, sandbox_init_point)
 * y el id_pago registrado en la BD.
 */
export const usePagos = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [initPoint, setInitPoint] = useState(null);
  const [idPago, setIdPago] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const crearPreferencia = useCallback(async (arg1, arg2 = 1, arg3, arg4) => {
    setCargando(true);
    setError(null);

    // Soporta tanto objeto ({ title, quantity, price, id_preinscripcion, ids_preinscripciones }) como argumentos sueltos
    const title = typeof arg1 === 'object' && arg1 !== null ? arg1.title : arg1;
    const quantity = typeof arg1 === 'object' && arg1 !== null ? (arg1.quantity ?? 1) : arg2;
    const price = typeof arg1 === 'object' && arg1 !== null ? arg1.price : arg3;
    const id_preinscripcion = typeof arg1 === 'object' && arg1 !== null ? arg1.id_preinscripcion : arg4;
    const ids_preinscripciones = typeof arg1 === 'object' && arg1 !== null ? arg1.ids_preinscripciones : undefined;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const endpoint = `${backendUrl}/api/pagos/mercadopago`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          quantity: Number(quantity) || 1,
          price: Number(price),
          id_preinscripcion: id_preinscripcion || undefined,
          ids_preinscripciones: ids_preinscripciones || undefined,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Error en el servidor (${response.status}: ${response.statusText})`;
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMessage = errorData.error;
          else if (errorData?.message) errorMessage = errorData.message;
        } catch {
          // Si no es JSON se mantiene el mensaje genérico
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const id = data?.id || data?.preferenceId;

      if (!id) {
        throw new Error('La respuesta del servidor no contiene un preferenceId válido.');
      }

      const point = data?.init_point || data?.sandbox_init_point || null;
      const pagoRegistradoId = data?.id_pago || null;

      setPreferenceId(id);
      setInitPoint(point);
      setIdPago(pagoRegistradoId);

      return {
        id,
        preferenceId: id,
        init_point: data?.init_point || null,
        sandbox_init_point: data?.sandbox_init_point || null,
        id_pago: pagoRegistradoId,
      };
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error inesperado al conectar con el servidor de pagos.';
      console.error('[usePagos] Error al procesar preferencia:', mensaje);
      setError(mensaje);
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    crearPreferencia,
    preferenceId,
    initPoint,
    idPago,
    cargando,
    error,
    setError,
  };
};

export default usePagos;
