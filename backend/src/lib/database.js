import mongoose from "mongoose"

export const ConnectDB= async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Missing MONGODB_URI in environment variables");
        }
        const con=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB is connected :${con.connection.host}`);
        
    } catch (error) {
        console.error("Mongodb connection failed :",error.message);
        
    }
    
}