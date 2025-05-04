import express from "express"
import { loginUser, logoutUser, signupUser, updateProfile, checkAuth } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router=express.Router()

router.post("/signup",signupUser)

router.post("/login",loginUser)

router.post("/logout",logoutUser)

router.put("/update-profile",protectRoute,updateProfile)   //protectRoute is a middleware that checks whether user is already login or not

router.get("/check",protectRoute,checkAuth)

export default router;