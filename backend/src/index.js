const express= require('express');
require('dotenv').config();
const connectDB= require('./lib/db');
const cookieParser= require('cookie-parser')
const cors= require('cors');

const PORT= process.env.PORT || 5001

const authRoutes= require('./routes/authRoutes');
const messageRoutes= require('./routes/messageRoutes');

const {app, server, io}= require('./lib/socket');

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
    connectDB();
})
