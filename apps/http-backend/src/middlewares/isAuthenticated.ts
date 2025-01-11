import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "@repo/backend-common/config";

export const isAuthenticated = async(req:Request, res:Response, next:NextFunction) : Promise<void> =>{
    try {
        const token = req.headers["authorization"] ?? "";

        const decode = jwt.verify(token , JWT_SECRET);

        if(!decode){
            res.status(401).json({message:"Invalid token"});
            return;
        }
        //@ts-ignore
        req.id = decode.name;

        next();

    } catch (error) {
        console.log(error);
        
    }
}