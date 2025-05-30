import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from '../Routes/router.js'
import connectDB from '../config/db.js'
import cors from 'cors';

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
    // Aquí agregaremos la URL de Netlify después
    process.env.FRONTEND_URL || 'https://tu-app.netlify.app'
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

app.use('/', router)


app.listen(PORT, console.log ('Server is running on port: '+ PORT));