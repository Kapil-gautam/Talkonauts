import jwt from "jsonwebtoken"
export const generateToken=(userId,res)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    

    //send the token via cookie
    res.cookie('jwt',token,{
        maxAge: 7*24 * 60 * 60 * 1000, // 7 day in milliseconds
        httpOnly: true,                // Prevents client-side JS from accessing the cookie
        sameSite: 'strict',          // CSRF protection: 'strict', 'lax', or 'none'
        secure: process.env.NODE_ENV !== "development" // Ensures the cookie is sent over HTTPS
    })

    return token;

}