import path from "node:path"
import fs  from "node:fs/promises"
import {env} from '../config/env';
import {redis} from "../config/redis"
import { consumeTokenResult } from "../types/tokenBucket";
import { error } from "node:console";

let scriptSha!:string;

export async function loadTokenBucketScript():Promise<void>{
    const scriptPath=path.join(process.cwd(),"src","lua","tokenBucket.lua");
    const script=await fs.readFile(scriptPath,"utf-8");
    scriptSha=await redis.scriptLoad(script);
    console.log(" Token Bucket Lua script loaded");
}
async function executeScript(key:string):Promise<number[]>{
    return(await redis.evalSha(scriptSha,{
        keys:[key],
        arguments:[
            env.RATE_LIMIT_CAPACITY.toString(),
            env.RATE_LIMIT_REFILL_RATE.toString(),
            env.RATE_LIMIT_TTL.toString(),
            Date.now().toString()
            
        ]
    }
    )) as number[];
}
export async function consumeToken(clientId:string):Promise<consumeTokenResult>{
    if(!scriptSha)throw new Error("Lua script has not been loaded");
    const key=`rateLimit:${clientId}`;
    let result!:number[];
    try{
        result=await executeScript(key); 
    }catch(err){
       if(err instanceof Error && err.message.includes("NOSCRIPT")){
            console.log("Missing Lua script.Reloading ...")
            await loadTokenBucketScript();
            result=await executeScript(key)
       }
       else{
        throw err;
       }
    }
    return {
        allowed:result[0]===1,
        remainingTokens:result[1],
        retryAfter:result[2]
    }

}