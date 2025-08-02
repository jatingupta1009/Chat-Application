const {User}= require('../models/user')
const {Message}= require('../models/message');
const cloudinary = require('../lib/cloudinary');
const { getReceiverSocketId, io } = require('../lib/socket');

const getUserForSidebar= async(req, res)=>{
    try
    {
        const loggedInUserId= req.user._id;
        const filteredUsers= await User.find({
            _id: {$ne: loggedInUserId}}).
        select("-password");

        res.status(200).json(filteredUsers);
    }
    catch(error)
    {
        console.log("error in getUserForSidebar", error.message);
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const getMessages= async(req, res)=>{
    try
    {
        const {id: userToChatId}= req.params;
        const myId= req.user._id;

        const messages= await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId}, 
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages);
    }
    catch(error)
    {
        console.log(error);
        console.log("error in get messages", error.message);
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const sendMessage= async(req, res)=>{
    try
    {   
        const {text, image}= req.body;
        const {id: receiverId}= req.params;

        const senderId= req.user._id;

        let imageUrl;

        if(image)
        {
            //upload to cloudinary
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId, 
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        //todo: socket lagana hai

        const receiverSocketId= getReceiverSocketId(receiverId);
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }
    catch(error)
    {
        console.log("error in send message", error.message);
        res.send(500).json({
            message: "internal server error"
        })
    }
}


module.exports= {getUserForSidebar, sendMessage, getMessages}