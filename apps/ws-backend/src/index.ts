import WebSocket, { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "@repo/backend-common/config"
import { prisma } from '@repo/database-common/prismaClient';
const wss = new WebSocketServer({port : 8080});

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}
const users: User[] = [];


function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  if (!users.some(u => u.userId === userId && u.ws === ws)) {
    users.push({
      userId,
      rooms: [],
      ws
    });
  }

  ws.on('message', async function message(data) {
    
    const parsedData = JSON.parse(data as unknown as string); // {type: "join-room", roomId: 1}

    if (parsedData.type === "join_room") {
      console.log(parsedData);
      
      const user = users.find(x => x.ws === ws);
      if (!user?.rooms.includes(parsedData.roomId)) {
        user?.rooms.push(parsedData.roomId);
      }
      
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      console.log(parsedData);
      
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const chat = await prisma.chat.create({
        data: {
          roomId : Number(roomId),
          message,
          userId
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId,
            id : chat.id
          }))
        }
      })
    }

    if(parsedData.type==="delete"){
      console.log(parsedData);
      
      const chatId = parsedData.chatId;
      const roomId = parsedData.roomId;
      const existingChat = await prisma.chat.findFirst({
        where: { id: Number(chatId) },
      });
      
      if (!existingChat) {
        console.log(`Chat with ID ${chatId} does not exist.`);
        return; // Handle the case where the record doesn't exist
      }

      let r = await prisma.chat.delete({
        where : {
          id : Number(chatId)
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "delete",
            roomId,
            chatId,
          }))
        }
      })
    }

  });

});