import {app, server} from './socket/socket.js'
import express from "express";
import { connectDB } from "./db/connection1.db.js";
import { errorMiddleware } from './middlewares/error.middleware.js';
import userRoutes from "./routes/user.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json());

const PORT = process.env.PORT || 5000;



app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`your server listening at port ${PORT}`);
});