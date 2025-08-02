const express= require('express');
require('dotenv').config();
const connectDB= require('./lib/db');
const cookieParser= require('cookie-parser')
const cors= require('cors');

const {app, server, io}= require('./lib/socket');

app.use(cors({
    origin: "https://chat-application-7fwi.onrender.com",
    credentials: true
}));

const PORT= process.env.PORT || 5001

const authRoutes= require('./routes/authRoutes');
const messageRoutes= require('./routes/messageRoutes');


app.use(express.json({ limit: '50mb' }));
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
    connectDB();
})
