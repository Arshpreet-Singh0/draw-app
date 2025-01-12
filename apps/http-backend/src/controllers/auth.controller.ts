import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema, SigninSchema} from '@repo/common/types'
import { prisma } from '@repo/database-common/prismaClient';

export const signup = async(req:Request, res:Response)=>{
    try {
        
        const data = CreateUserSchema.safeParse(req.body);

        if(!data.success){
            res.status(400).json({message:"Everyfield is required"});
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                email : req.body.email,
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

        const data = SigninSchema.safeParse(req.body);

        if(!data.success){
            res.status(400).json({message:"Everyfield is required"});
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                email : req.body.eamil,
            }
        });

        if(!user){
            res.status(400).json({
                message : "Invalid username or password.",
                success : "false",
            });
            return;
        }

        const isPasswordMatched = bcrypt.compare(req.body.password, user.password);

        if(!isPasswordMatched){
            res.status(403).json({
                message : "Invalid password.",
                success : "false",
            });
        }

        const token = jwt.sign({name : user.name}, JWT_SECRET);

        res.status(200).json({
            message : "Signin succesfull",
            success : "true",
            token,
        });
        
    } catch (error) {
        console.log(error);
    }
}