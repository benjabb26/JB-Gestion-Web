import BotonMercadoPago from './components/BotonMercadoPago';

/**
 * Vista de Checkout / Pasarela de Pagos (Página de prueba)
 *
 * Muestra el resumen de compra con datos de prueba e integra el BotonMercadoPago
 * para procesar la transacción directamente.
 */
export const CheckoutPage = () => {
  // Datos de prueba especificados en el requerimiento
  const productoPrueba = {
    titulo: 'Curso de prueba',
    precio: 150,
    cantidad: 1,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Cabecera del Checkout */}
        <div className="bg-gradient-to-r from-[#112842] via-[#1a385c] to-[#112842] p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm mb-3">
            <i className="fas fa-shield-alt text-2xl text-[#af7e35]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Checkout Seguro</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            JB Gestión y Capital Humano - Pasarela Mercado Pago
          </p>
        </div>

        {/* Resumen del Producto */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Resumen del Pedido
            </h2>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-bold text-slate-800 text-base">{productoPrueba.titulo}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cantidad: <span className="font-semibold text-slate-700">{productoPrueba.cantidad}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#112842]">
                  S/ {productoPrueba.precio.toFixed(2)}
                </span>
                <p className="text-[10px] text-slate-400">PEN</p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 mt-4 pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">Total a pagar:</span>
              <span className="font-black text-xl text-[#af7e35]">
                S/ {(productoPrueba.precio * productoPrueba.cantidad).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Información de Garantía */}
          <div className="flex items-center gap-3 text-xs text-slate-500 px-1">
            <i className="fas fa-lock text-emerald-600 text-sm" />
            <span>Transacciones cifradas de extremo a extremo por Mercado Pago.</span>
          </div>

          {/* Componente del Botón de Pago */}
          <div className="pt-2">
            <BotonMercadoPago
              titulo={productoPrueba.titulo}
              precio={productoPrueba.precio}
              cantidad={productoPrueba.cantidad}
            />
          </div>
        </div>

        {/* Pie de página de la tarjeta */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            ¿Tienes dudas con tu pago? Contáctanos a{' '}
            <a href="mailto:soporte@jbgestion.com" className="text-[#af7e35] font-semibold hover:underline">
              soporte@jbgestion.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
