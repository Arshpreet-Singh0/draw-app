import express from "express";
const app = express();
import authRouter from './routes/auth.routes';
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { prisma } from "@repo/database-common/prismaClient";
import {CreateRoomSchema} from '@repo/common/types';
import cors from 'cors';

app.use(express.json());
app.use(cors({
    origin : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
}))

app.post('/room', isAuthenticated, async(req, res)=>{
    
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body);
 
        if(!parsedData.success){
            res.status(400).json({message: 'Invalid data'});
            return;
        }
        const r = await prisma.room.findFirst({
            where : {
                slug : parsedData.data.name,
            }
        });
        if(r){
            res.status(400).json({
                message : "Room already exist try different name",
                success : false,
            })
            return;
        }
        const userId = req.userId;
    
        const room = await prisma.room.create({
            data : {
                adminId : String(userId),
                slug : req.body.name,
            }
        });
    
        res.status(200).json({
            message : "Room created successfully",
            id : room.id,
            success : true
        })
        
    } catch (error) {
        console.log(error);
    }
});

app.get('/room', isAuthenticated, async(req, res)=>{
    try {
        const adminId = req.userId;

        const rooms = await prisma.room.findMany({
            where : {
                adminId : adminId,
            }
        })


        res.status(200).json({
            rooms
        })
    } catch (error) {
        console.log(error);
        
    }
})

app.get('/checkroom/:id', async(req, res)=>{
    try {
        const id = req.params.id;

        const room = await prisma.room.findUnique({
            where : {
                id : Number(id),
            }
        });

        if(!room){
            res.status(200).json({
                success : false,
            })
            return;
        };

        res.status(200).json({
            success : true,
        })
        
    } catch (error) {
        console.log(error);
        
    }
})
app.get('/room/:name', isAuthenticated, async(req, res)=>{
    try {
        const name = req.params.name;

        const room = await prisma.room.findFirst({
            where : {
                slug : name
            }
        });

        if(!room){
            res.status(404).json({
                message : "Room not found.",
                success : false,
            });
            return;
        }


        res.status(200).json({
            id : room.id,
            success : true,
        })
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/chats/:roomId", async(req, res)=>{
    try {
        const roomId = Number(req.params.roomId);
        console.log(roomId);
        

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


app.listen(3003, ()=>{
    console.log("listening to port 3003");  
})