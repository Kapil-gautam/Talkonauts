import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

const signupUser=async (req,res)=>{
    const{fullName,email,password}=req.body;
    try {
        //credential verification

        // if([fullName,email,password].some(field => !field || field.trim() === "")){
        //     res.status(400).json({message:"All fields are necessary"})
        // }
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        if (!(email.includes("@") && email.includes("."))) {
            return res.status(400).json({message:"Enter email in correct format"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be of minimum 6 letters"})
        }
        
        const user= await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already exist"})
        }

        // hashing the password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new User({
            fullName,
            email,
            password:hashedPassword
        })


        if (newUser) {
            await newUser.save()

            //generate JWT Token
            generateToken(newUser._id,res)
            
            res.status(200).json({
                message:"User is SignIn Successfully",
                _id:newUser._id,
                fullName:newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            });
            
        } else {
            res.status(400).json({message:"Invalid data entry"})
        }
        
    } catch (error) {
        console.error("Failed to signup user",error.message)
        res.status(500).json({message:"Internal Server error while Signup"})
    }
}
const loginUser=async (req,res)=>{
    try {
        const{email,password} =req.body;
        
        if(!email || !password){
            return res.status(400).json({message:"Email and password is Empty"})
        }

        const existedUser=await User.findOne({email})
        if(!existedUser){
            return res.status(400).json({message:"No user found"})
        }

        const isMatch=await bcrypt.compare(password, existedUser.password)
        if(!isMatch){
            return res.status(400).json({message:"Password is incorrect"})
        }

        //generate jwt token
        generateToken(existedUser._id,res)

        res.status(200).json({
            message:"User is LoggedIn Successfully",
            _id:existedUser._id,
            fullName:existedUser.fullName,
            email: existedUser.email,
            profilePic: existedUser.profilePic,

        })

        

    } catch (error) {
        console.error("Failed to login User :",error.message);
        res.status(500).json({message:"Internal Server error while Login "})
        
    }
    
}
const logoutUser=async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"User Logged Out Successfully"})

    } catch (error) {
        console.error("Error while logging out : ",error.message);
        res.status(500).json({message:"Internal Server error while Logout "})
        
    }
}

const updateProfile=async(req,res)=>{
    try {
    const{profilePic}=req.body;
    const userId=req.user._id;

    if(!profilePic){
        res.status(404).json({message:"No profile pics found"})
    }

    const uploadResponse=await cloudinary.uploader.upload(profilePic)
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

    res.status(200).json(updatedUser)

    } catch (error) {
        console.error("Error wile updating image:",error.message);
        res.status(500).json({message:"Internal server error"})
        
    }
}

const checkAuth=async(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in checkAuth controller :",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export {
    signupUser,
    loginUser,
    logoutUser,
    updateProfile,
    checkAuth
}