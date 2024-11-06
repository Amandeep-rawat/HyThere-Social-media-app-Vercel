import mongoose from "mongoose"

const connection=async()=>{
    try{
        const db=await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${db.connection.host}`)
    }
    catch(err){
        console.log(err)
    }
}
export default connection;