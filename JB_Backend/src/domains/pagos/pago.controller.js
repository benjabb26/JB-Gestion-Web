import {
    crearPreferenciaMercadoPago,
    confirmarPagoService,
    iniciarPagoService,
} from './pago.service.js';

export const iniciarPagoController = async (req, res) => {
    try {
        const { id_preinscripcion, ids_preinscripciones, monto, titulo } = req.body;
        if (!id_preinscripcion && (!ids_preinscripciones || ids_preinscripciones.length === 0)) {
            return res.status(400).json({ error: 'id_preinscripcion o ids_preinscripciones es obligatorio.' });
        }

        const resultado = await iniciarPagoService({ id_preinscripcion, ids_preinscripciones, monto, titulo });
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en iniciarPagoController:', error);
        return res.status(500).json({ error: error.message || 'Error al iniciar pago' });
    }
};

export const crearPago = async (req, res) => {
    try {
        const datosPago = req.body;

        if (!datosPago?.title || datosPago?.price === undefined || datosPago?.price === null) {
            return res.status(400).json({
                error: 'Parámetros requeridos faltantes: se espera title y price.',
            });
        }

        const resultado = await crearPreferenciaMercadoPago(datosPago);

        return res.status(200).json({
            id: resultado.id,
            preferenceId: resultado.id,
            init_point: resultado.init_point,
            sandbox_init_point: resultado.sandbox_init_point,
            id_pago: resultado.id_pago,
        });
    } catch (error) {
        console.error('Error en crearPago controller:', error);
        return res.status(500).json({
            error: error.message || 'Error al generar la preferencia de pago',
        });
    }
};

export const confirmarPagoController = async (req, res) => {
    try {
        const { id_preinscripcion, ids_preinscripciones, id_clase, numero_operacion, metodo_pago, monto } = req.body;

        if (!id_preinscripcion && (!ids_preinscripciones || ids_preinscripciones.length === 0)) {
            return res.status(400).json({
                error: 'El campo id_preinscripcion o ids_preinscripciones es obligatorio.',
            });
        }

        const resultado = await confirmarPagoService({
            id_preinscripcion,
            ids_preinscripciones,
            id_clase,
            numero_operacion,
            metodo_pago,
            monto,
        });

        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en confirmarPagoController:', error);
        return res.status(500).json({
            error: error.message || 'Error al confirmar el pago en la base de datos',
        });
    }
};

export default {
    iniciarPagoController,
    crearPago,
    confirmarPagoController,
};
