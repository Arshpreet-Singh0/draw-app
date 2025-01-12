import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema, SigninSchema} from '@repo/common/types'
import { prisma } from '@repo/database-common/prismaClient';

export const signup = async(req:Request, res:Response)=>{
    try {
        
        const parsedData = CreateUserSchema.safeParse(req.body);

        if(!parsedData.success){
            res.status(400).json({message:"Everyfield is required"});
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                email : parsedData.data.email,
            }
        })

        if(user){
            res.status(400).json({
                message : "Username already exists.",
                suceess : "false",
            });
            return;
        };
        const hashedPassword = await bcrypt.hash(req.body.password, 5);

        await prisma.user.create({
            data : {
                email : req.body.email,
                name : req.body.name,
                password : hashedPassword,
            }
        })
        

        res.status(200).json({
            message : "Account created successfully.",
            success : "true",
        });
        
    } catch (error) {
        console.log(error);
        
    }
}
export const signin = async(req:Request, res:Response)=>{
    try {

        const parsedData = SigninSchema.safeParse(req.body);
        
        if(!parsedData.success){
            res.status(400).json({message:"Everyfield is required"});
            return;
        }

        const user = await prisma.user.findFirst({
            where : {
                email : parsedData.data.email,
            }
        });

        if(!user){
            res.status(400).json({
                message : "Invalid username or password.",
                success : "false",
            });
            return;
        }

        const isPasswordMatched = bcrypt.compare(parsedData.data.password, user.password);

        if(!isPasswordMatched){
            res.status(403).json({
                message : "Invalid password.",
                success : "false",
            });
        }

        const token = jwt.sign({userId : user.id}, JWT_SECRET);

        res.status(200).json({
            message : "Signin succesfull",
            success : "true",
            token,
        });
        
    } catch (error) {
        console.log(error);
    }
}