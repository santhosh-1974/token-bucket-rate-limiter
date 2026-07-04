import { Request,Response,NextFunction } from "express"
import {consumeToken} from "../services/tokenBucket.service"
import { env } from "../config/env";

export async function rateLimiter(req:Request,res:Response,next:NextFunction):Promise<void>{
    try{
        const clientId=req.ip;
        if (!clientId) {
            res.status(400).json({
                success: false,
                message: "Unable to determine client IP",
            });
        return;
        }
        const result=await consumeToken(clientId);
        res.setHeader("X-RateLimit-limt",env.RATE_LIMIT_CAPACITY)
        res.setHeader("X-RateLimit-remaining",result.remainingTokens.toString());
        if(!result.allowed){
            res.setHeader("Retry-After",result.retryAfter.toString());
            res.status(429).json({
                success: false,
                message: "Too Many Requests",
            })
            return ;
        }
        next();
    }catch(err){
        next(err);
    }
}