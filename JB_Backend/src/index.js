import 'dotenv/config'; // Carga las variables de .env
import express from 'express';
import cors from 'cors';

// Importamos las rutas de nuestro dominio de pagos
import pagoRoutes from './domains/pagos/pago.routes.js';

const app = express();

// Configuración flexible de CORS para permitir conexiones desde Vite en cualquier puerto localhost
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                callback(null, true);
            } else {
                callback(null, true); // En desarrollo permitir orígenes
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// Montamos el módulo de pagos bajo el prefijo /api/pagos
app.use('/api/pagos', pagoRoutes);

// Endpoint de diagnóstico rápido
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'JB_Backend Pagos API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor JB_Backend corriendo en http://localhost:${PORT}`);
});
