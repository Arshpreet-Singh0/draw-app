import { Request, Response } from "express";
// import {z} from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema} from '@repo/common/types'

export const signup = async(req:Request, res:Response)=>{
    try {
        
        const data = CreateUserSchema.safeParse(req.body);

        if(!data.success){
            res.status(400).json({message:"Everyfield is required"});
            return;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 5);

        res.status(200).json({
            message : "Account created successfully.",
            success : "true",
        });
        
    } catch (error) {
        console.log(error);
        
    }
}
export const signin = (req:Request, res:Response)=>{
    try {
        const {name, email, password} = req.body;

        if(!email || !password){
            res.json({
                message : "all fields required.",
            });
            return;
        }

        const isPasswordMatched = bcrypt.compare(password, password);

        if(!isPasswordMatched){
            res.status(403).json({
                message : "Invalid password.",
                success : "false",
            });
        }

        const token = jwt.sign({name : name}, JWT_SECRET);

        res.status(200).json({
            message : "Signin succesfull",
            success : "true",
            token,
        });
        
    } catch (error) {
        console.log(error);
    }
}