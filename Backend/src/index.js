import express from 'express'
import dotenv from 'dotenv'
import os from 'os'
import cookieParser from 'cookie-parser'
import router from '../Routes/router.js'
import connectDB from '../config/db.js'
import cors from 'cors';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Configurar CORS para producción y desarrollo
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    // Agrega aquí tu URL de Netlify cuando la tengas
    process.env.FRONTEND_URL,
    'https://tu-app.netlify.app' // Reemplaza con tu URL real de Netlify
  ], 
  credentials: true 
}));

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Ruta básica para verificar que funciona
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// Health check mejorado para Consul y HAProxy: verifica conexión a MongoDB
// y expone identidad del nodo/replica que responde
const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/health', (req, res) => {
  const dbState = DB_STATES[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1;
  res.status(healthy ? 200 : 503).json({
    node: process.env.NODE_ID || os.hostname(),
    instance: process.env.INSTANCE_ID || null,
    status: healthy ? 'ok' : 'degraded',
    db: dbState
  });
});

// Devuelve qué instancia concreta respondió (para demostrar el balanceo)
app.get('/whoami', (req, res) => {
  res.json({
    node: process.env.NODE_ID || os.hostname(),
    instance: process.env.INSTANCE_ID || null,
    hostname: os.hostname(),
    pid: process.pid,
    port: process.env.PORT || 8080
  });
});

// Usar el router para otras rutas
app.use('/api', router)

// Para Vercel, exportar la app
export default app;

// El servidor siempre escucha (también en producción) para desplegarse en VM
// detrás de un balanceador. Se mantiene la exportación para usos serverless.
app.listen(PORT, () => {
  console.log('Server is running on port: ' + PORT);
});