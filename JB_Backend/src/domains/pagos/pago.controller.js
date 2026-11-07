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

export const webhookMercadoPago = async (req, res) => {
    try {
        // 1. Obtener el ID del pago desde query o body
        const paymentId = req.query.id || req.query['data.id'] || req.body?.data?.id;

        // 2. Verificar que el evento sea de tipo pago
        const isPayment =
            req.query.topic === 'payment' ||
            req.query.type === 'payment' ||
            req.type === 'payment' ||
            req.body?.type === 'payment' ||
            req.body?.action?.startsWith('payment');

        if (paymentId && isPayment) {
            console.log(`[webhookMercadoPago] Notificación de pago recibida para ID: ${paymentId}`);

            // 3. Consultar la API oficial de Mercado Pago para verificar autenticidad y estado
            const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
            });

            if (mpResponse.ok) {
                const paymentData = await mpResponse.json();

                // 4. Si el pago está aprobado, confirmar la inscripción y actualizar BD
                if (paymentData.status === 'approved') {
                    const { external_reference, transaction_amount } = paymentData;

                    console.log(`[webhookMercadoPago] Pago ${paymentId} APROBADO. Confirmando preinscripción: ${external_reference}`);

                    await confirmarPagoService({
                        id_preinscripcion: external_reference,
                        numero_operacion: paymentId.toString(),
                        metodo_pago: 'mercadopago',
                        monto: transaction_amount,
                    });
                } else {
                    console.log(`[webhookMercadoPago] Pago ${paymentId} recibido con estado: ${paymentData.status}`);
                }
            } else {
                console.error(`[webhookMercadoPago] Error consultando API de Mercado Pago para pago ${paymentId}: Status ${mpResponse.status}`);
            }
        }

        // SIEMPRE retornar 200 OK a Mercado Pago
        return res.status(200).send('OK');
    } catch (error) {
        console.error('[webhookMercadoPago] Error en webhook de Mercado Pago:', error);
        // MUY IMPORTANTE: Retornar 200 OK incluso en el catch para evitar reintentos infinitos
        return res.status(200).send('OK');
    }
};

export default {
    iniciarPagoController,
    crearPago,
    confirmarPagoController,
    webhookMercadoPago,
};
