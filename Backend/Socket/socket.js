import { Server } from "socket.io"
import express from "express";
import http from "http"

const app = express();



const server = http.createServer(app);

console.log('frontend url in socket.js is ',process.env.URL)
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    addTrailingSlash: false,
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true
})

const userSocketMap = {};//this map stores socket id corresponds to the user id

export const getReceiverSocketId=(receiverId)=> userSocketMap[receiverId];


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
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




io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });



export { io, server ,app}
// ab index.js me kuch changees he 

