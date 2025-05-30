import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from '../Routes/router.js'
import connectDB from '../config/db.js'
import cors from 'cors';

const app = express();
const PORT = 8080;
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  credentials: true 
}));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', router)
app.use(cookieParser())


app.listen(PORT, console.log ('Server is running on port: '+ PORT));