import express from 'express'
import http from 'http'
import {Server} from 'socket.io'

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})

//store the online users
const userSocketMap={}; //store data in the format of , {userId:socketId}

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id)

    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;

    //io.emit() is used to broadcast events to all the connected clients
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];

        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})

function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}


export { io, app, server,getReceiverSocketId };