import express from "express";
const app = express();
import authRouter from './routes/auth.routes';
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { prisma } from "@repo/database-common/prismaClient";
import {CreateRoomSchema} from '@repo/common/types'

app.use(express.json());

app.post('/room', isAuthenticated, async(req, res)=>{
    
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(400).json({message: 'Invalid data'});
            return;
        }
        //@ts-ignore
        const userId = req.userId;
    
        const room = await prisma.room.create({
            data : {
                adminId : userId,
                slug : req.body.name,
            }
        });
    
        res.status(200).json({
            message : "Room created successfully",
            id : room.id,
        })
        
    } catch (error) {
        console.log(error);
    }
});

app.get("/chats/:roomId",isAuthenticated, async(req, res)=>{
    try {
        const roomId = Number(req.params.roomId);

        const chats = await prisma.chat.findMany({
            where : {
                roomId : roomId,
            },
            orderBy : {
                id : "desc",
            },
            take : 50,
        });

        res.status(200).json({
            chats
        })
    } catch (error) {
        console.log(error);
        
    }
})

app.use('/', authRouter);


app.listen(3001, ()=>{
    console.log("listening to port 3001");  
})