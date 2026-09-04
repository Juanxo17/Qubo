import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME || 'Qubo'
        })
        console.log('Mongo connected succesfuly.')
    }
    catch(error){
        // No matamos el proceso: el health check /health reflejará el estado de la BD.
        // Esto mantiene el servidor disponible (para el balanceador) aunque Mongo falle.
        console.error("Failed to connect with MongoDB.", error.message)
    }
}

export default connectDB;