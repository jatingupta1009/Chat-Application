import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import generateToken from '../lib/utils.js';
import cookie from 'cookie-parser';
import cloudinary from '../lib/cloudinary.js';

const signup= async (req,res)=>{
    const {fullName, email, password}= req.body; 

    //console.log(req.body);

    try
    {
        if(!fullName || !email || !password)
            return res.status(400).json({
                message: 'all fields are requied'
            });

        //hashing password
        if(password.length < 6)
        {
            return res.status(400).json({
                message: 'password must be 6 characters'
            });
        }

        const user= await User.findOne({email});

        if(user)
            return res.status(400).json({
                message: 'user already exist'
            });

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            fullname: fullName,
            email: email,
            password: hashedPassword
        })
   
        if(newUser)
        {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullname: fullName,
                email: email,
                password: hashedPassword
            })
        }
        else
        {
            return res.send(400).json({
                message: 'invalid creditentials'
            })
        }
    }
    catch(error)
    {
        console.log("errror in signup controller", error.message);
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

const login= async (req,res)=>{
    const {email, password}= req.body;
    try
    {
        const user= await User.findOne({ email });
        
        if(!user)
        {
            return res.status(404).json({
                message: "invalid creditentials"
            })
        }

        const isPasswordCorrect= await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect)
        {
            return res.status(404).json({
                message: "invalid creditentials"
            })
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        })     
       
    }
    catch(error)
    {
        console.log("error in login controller", error.message);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const logout= (req,res)=>{
    try
    {
        res.cookie("jwt", "", {
            maxAge: "0"
        })

        return res.status(200).json({
            message: "logout successful"
        })
    }
    catch(error)
    {
        console.log("error in logout controller", error.message);
        return res.send(500).json({
            message: "interval server error"
        })
    }
}

const updateProfile= async (req, res)=>{
    try
    {
        //console.log(req.body);
        const { profilePic }= req.body;
        const userId= req.user._id;
        
        if(!profilePic)
        {
            return res.status(400).json({
                message: "profile pic not provided"
            })
        }

        const uploadRespone= await cloudinary.uploader.upload(profilePic);
    
        const updatedUser= await User.findByIdAndUpdate(userId, {
            profilePic: uploadRespone.secure_url
        },{new: true})

        return res.status(200).json(updatedUser)
    }
    catch(error)
    {
        console.log("error in update profile controller", error.message);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const checkAuth= (req, res)=>{
    try
    {
        res.status(200).json(req.user);
    }
    catch(error)
    {
        console.log("error in checkAuth controller", error.message);
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export { signup, login, logout, updateProfile, checkAuth };
