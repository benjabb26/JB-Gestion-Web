import { useState } from 'react';
import usePagos from '../hooks/usePagos';

/**
 * Componente BotonMercadoPago
 *
 * SEGURIDAD: Todo el flujo de pago pasa EXCLUSIVAMENTE por el backend (JB_Backend).
 * No se realiza ninguna escritura directa a Supabase desde el frontend.
 * Si el backend no responde, el proceso se detiene y se muestra un error al usuario.
 *
 * Al hacer clic en "Pagar con Mercado Pago":
 * 1. Llama al backend para generar la preferencia de pago en Mercado Pago.
 * 2. Redirecciona al usuario a la pasarela oficial de Mercado Pago.
 * 3. Al retornar aprobado, el backend (via webhook o confirmación) actualiza la BD.
 *
 * @param {Object} props
 * @param {string} props.titulo - Nombre del curso/producto.
 * @param {number|string} props.precio - Monto total a pagar.
 * @param {number|string} [props.cantidad=1] - Cantidad.
 * @param {number|string} [props.id_preinscripcion] - ID de la preinscripción asociada en la BD.
 * @param {number[]|string[]} [props.ids_preinscripciones] - Lista de IDs de preinscripciones (multi-curso).
 */
export const BotonMercadoPago = ({
  titulo,
  precio,
  cantidad = 1,
  id_preinscripcion,
  ids_preinscripciones,
}) => {
  const { crearPreferencia, cargando, error } = usePagos();
  const [redireccionando, setRedireccionando] = useState(false);
  const [urlRedireccion, setUrlRedireccion] = useState(null);
  const [errorLocal, setErrorLocal] = useState(null);

  const handlePagar = async () => {
    if (cargando || redireccionando) return;
    setErrorLocal(null);

    try {
      // Única vía: el backend genera la preferencia y registra el pago en BD.
      // Si el backend no responde, crearPreferencia lanzará un error y se detiene el proceso.
      const res = await crearPreferencia({
        title: titulo,
        price: precio,
        quantity: cantidad,
        id_preinscripcion,
        ids_preinscripciones,
      });

      if (res) {
        const destino = res.init_point || res.sandbox_init_point;
        if (destino) {
          setRedireccionando(true);
          setUrlRedireccion(destino);
          // Redirección inmediata a la pasarela oficial de Mercado Pago
          window.location.href = destino;
        } else {
          setErrorLocal('El servidor no devolvió una URL de pago válida. Intenta nuevamente.');
        }
      }
    } catch (err) {
      console.error('[BotonMercadoPago] Error durante el proceso de pago:', err);
      setErrorLocal('No se pudo conectar con el servidor de pagos. Verifica tu conexión e intenta nuevamente.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Botón Principal: Pagar con Mercado Pago */}
      <button
        type="button"
        onClick={handlePagar}
        disabled={cargando || redireccionando}
        className="w-full py-4 px-6 rounded-2xl bg-[#009ee3] hover:bg-[#0081ba] text-white font-black text-base sm:text-lg shadow-xl shadow-[#009ee3]/25 hover:shadow-2xl hover:shadow-[#009ee3]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {cargando || redireccionando ? (
          <>
            <i className="fas fa-spinner fa-spin text-xl" />
            <span>Redireccionando a Mercado Pago...</span>
          </>
        ) : (
          <>
            <img
              src="/mercadopago-logo.svg"
              alt="Mercado Pago"
              className="h-6 sm:h-7 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <span>Pagar con Mercado Pago</span>
            <i className="fas fa-arrow-right text-sm ml-1" />
          </>
        )}
      </button>

      {/* Si por alguna razón el navegador bloqueó la redirección automática */}
      {urlRedireccion && (
        <div className="w-full text-center p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm">
          <span>Si la ventana no se abrió automáticamente, </span>
          <a
            href={urlRedireccion}
            className="font-bold underline hover:text-blue-700"
          >
            haz clic aquí para ir a Mercado Pago
          </a>
        </div>
      )}

      {/* Mensaje de error si el backend no responde o falla */}
      {(error || errorLocal) && (
        <div className="w-full p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <i className="fas fa-exclamation-circle text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">No se pudo iniciar el pago</p>
            <p className="text-xs text-red-600 mt-0.5">{errorLocal || error}</p>
            <p className="text-xs text-red-500 mt-1 font-medium">
              El servidor de pagos no está disponible en este momento. Por favor intenta más tarde o contáctanos por WhatsApp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotonMercadoPago;
