import express from "express"
import { rateLimiter } from "./middleware/rateLimiter"
const app=express()

app.use(express.json())

app.get("/health",(req,res)=>{
    res.json({
        status:"OK"
    })
})
app.use(rateLimiter);

export default app;