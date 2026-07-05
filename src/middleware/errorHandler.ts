import {NextFunction, Request,Response,} from "express"
export async function errorHandler(err:Error,req:Request,res:Response,next:NextFunction){
    console.error(err);
    res.status(500).json({
            success: false,
        message: "Internal Server Error",
    });

}