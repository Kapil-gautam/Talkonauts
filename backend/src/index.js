import express from "express"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import dotenv from "dotenv"
import { ConnectDB } from "./lib/database.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app,server } from "./lib/socket.js"


dotenv.config()

const PORT=process.env.PORT

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())   //it should always be written on top of the routes
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Only if you're sending cookies or authorization headers
  }));

//declaring  routes
app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter)


server.listen(PORT,()=>{
    console.log("App is running on port :"+ PORT);
    ConnectDB();
})