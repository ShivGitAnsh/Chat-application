import dotenv from 'dotenv';
dotenv.config()
import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();

const server = http.createServer(app);

const io = new Server(server, {cors : { origin: process.env.CLIENT_URL}})

const userSocketMap = {

}

io.on('connection', (socket) => {
   const userId = socket.handshake.query.userId
   if(!userId)
    return
   userSocketMap[userId] = socket.id;
   io.emit("onlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });

  socket.on("typing", ({ to, from }) => {
    const toSocketId = userSocketMap[to];
    if (toSocketId) {
      io.to(toSocketId).emit("typing", { from });
    }
  });

 socket.on("stop_typing", ({ to, from }) => {
    const toSocketId = userSocketMap[to];
    if (toSocketId) {
      io.to(toSocketId).emit("stop_typing", { from });
    }
  });
});

const getSocketId = (userId) => {
      return userSocketMap[userId];
}

export {io, app, server, getSocketId}
