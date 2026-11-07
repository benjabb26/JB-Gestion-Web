import { Router } from 'express';
import {
    iniciarPagoController,
    crearPago,
    confirmarPagoController,
    webhookMercadoPago,
} from './pago.controller.js';

const router = Router();

// Inicia y asegura registro de pago pendiente
router.post('/iniciar', iniciarPagoController);

// Genera preferencia de Mercado Pago y vincula con la BD
router.post('/mercadopago', crearPago);

// Confirma el pago, pasa estado a inscrito y descuenta vacante
router.post('/confirmar', confirmarPagoController);

// Webhook de Mercado Pago
router.post('/webhook', webhookMercadoPago);

export default router;
