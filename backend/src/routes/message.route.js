import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message.controller.js";

const router=express.Router()  //we also name it like const messageRouter= .....

router.get('/users',protectRoute,getUsersForSidebar)

router.get('/:id',protectRoute,getMessages)

router.post('/send/:id',protectRoute,sendMessage)

export default router;