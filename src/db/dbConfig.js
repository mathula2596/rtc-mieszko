import mongoose from 'mongoose'

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log('database connection success')
        })

        connection.on('error',(error)=>{
            console.log('database connection failed: '+error)
        })
    } catch (error) {
        console.log(error);
        
    }
}

export async function connectToDatabase() {
    await connect();
    const db = mongoose.connection.db;
    return { db };
}