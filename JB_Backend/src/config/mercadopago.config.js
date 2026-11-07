import 'dotenv/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Verifica que el token exista para evitar errores en tiempo de ejecución
if (!process.env.MP_ACCESS_TOKEN) {
    console.error("Falta el MP_ACCESS_TOKEN en el archivo .env");
}

// Inicializa el cliente oficial de Mercado Pago v2
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// Exportamos el cliente y las clases que necesites (como Preference para generar el cobro)
export { mpClient, Preference };
