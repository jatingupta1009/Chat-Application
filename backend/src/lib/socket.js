const { Server }= require('socket.io');
const http= require('http');
const express= require('express');

const app= express();
const server= http.createServer(app);

const io= new Server(server, {
    cors:{
        origin: ["https://chat-application-7fwi.onrender.com"]
    }
});

const getReceiverSocketId= (userId)=>{
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap= {}; //userId: socketId

io.on("connection", (socket)=>{
    console.log("user connected", socket.id);

    const userId= socket.handshake.query.userId;

    if(userId)
    {
        userSocketMap[userId]= socket.id;
    }

    //io.emit used to send events to all connected clients
    io.emit("getOnlineUsers",  Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",  Object.keys(userSocketMap));
    })
})

module.exports= {app, server, io, getReceiverSocketId};
