import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from "@repo/backend-common/config";

export const isAuthenticated = async(req:Request, res:Response, next:NextFunction) : Promise<void> =>{
    try {
        const token = req.headers["authorization"] ?? "";

        const decode = jwt.verify(token , JWT_SECRET) as JwtPayload;
        
        if(!decode){
            res.status(401).json({message:"Invalid token"});
            return;
        }
        //@ts-ignore
        req.userId = decode.userId;

        next();

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        
    }
}