import { Server } from "socket.io"
import express from "express";
import http from "http"
const app = express();


const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST']
    }
})

const userSocketMap = {};//this map stores socket id corresponds to the user id

export const getReceiverSocketId=(receiverId)=> userSocketMap[receiverId];


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) { //agr usedid he means logged in he 
        userSocketMap[userId] = socket.id;
        console.log(`user connected: userId =${userId}, socketId=${socket.id}`)

    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId) {
            console.log(`user disconnected: userId =${userId}, socketId=${socket.id}`)
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})
export { io, server ,app}
// ab index.js me kuch changees he 