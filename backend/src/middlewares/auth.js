const jwt= require('jsonwebtoken');
const {User}= require('../models/user')

const protectRoute= async(req, res, next)=>{
    try
    {
        const token= req.cookies.jwt;

        if(!token)
        {
            return res.status(401).json({
                message: "Unauthorized, token not provided"
            })
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded)
        {
            return res.status(401).json({
                message: "invalid token"
            })
        }

        const user= await User.findById(decoded.userId).select("-password");

        if(!user)
        {
            return res.status(404).json({
                message: "user not found"
            })
        }

        req.user= user;
        next();
    }
    catch(error)
    {
        console.log("error in middleware protect route", error.message); 
    }
}

module.exports= protectRoute