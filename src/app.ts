import express from "express"
import { rateLimiter } from "./middleware/rateLimiter"
import { errorHandler } from "./middleware/erroHandler"
const app=express()

app.set("trust proxy", true);
app.use(express.json())
app.use(rateLimiter)
app.get("/health",(req,res)=>{
    res.json({
        status:"OK"
    })
})


app.use(errorHandler)
export default app;