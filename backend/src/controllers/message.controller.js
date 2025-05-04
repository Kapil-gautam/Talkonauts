import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";


const getUsersForSidebar=async (req,res) => {
    try {
        const loggedinUser=req.user._id;
        const filteredUser=await User.find({id:{$ne:loggedinUser}}).select("-password")
    
        res.status(200).json(filteredUser)
    } catch (error) {
        console.error("User can't be fetched for Sidebar :",error);
        res.status(500).json({error:"Internal Server Error"})      
    }
}

const getMessages=async (req,res) => {
    try {
        const{id:userToChatId}=req.params
        const myId=req.user._id
    
        const messages=await Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId },
                {senderId:userToChatId, receiverId:myId}
            ]
        })
    
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const sendMessage=async (req,res) => {
    try {
        const {text,image}=req.body
        const {id:receiverId}=req.params
        const senderId=req.user._id
    
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }
    
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
    
        await newMessage.save();

        //reatime functionality will be added .
        // Socket.io

        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}




export {
    getUsersForSidebar,
    getMessages,
    sendMessage
}