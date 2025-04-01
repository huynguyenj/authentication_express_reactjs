import mongoose from "mongoose"

export const connectDB = async () =>{
      try {
            const connect = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB connected: ${connect.connection.host}`)
      } catch (error) {
            console.log("Error connection to MongoDB: ",error.message);
            process.exit(1) // 1 is failure, 0 status code is success
      }      
}