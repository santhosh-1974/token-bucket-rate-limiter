import express from "express"
import { rateLimiter } from "./middleware/rateLimiter"
import { errorHandler } from "./middleware/errorHandler"
const app=express()

app.set("trust proxy", true);
app.use(express.json())
app.use(rateLimiter)
app.get("/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"API is healthy"
    })
})
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"API is healthy"
    })
})



app.use(errorHandler)
export default app;