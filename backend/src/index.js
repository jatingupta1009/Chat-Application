import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const PORT= process.env.PORT || 5001;

import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import { app, server, io } from './lib/socket.js';

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
    connectDB();
})
