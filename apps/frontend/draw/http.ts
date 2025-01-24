import { HTTP_BACKEND } from "@/Config";
import axios from "axios";

export async function getExistingShapes(roomId: number) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.chats;
  
    return messages.map((x: { id : number, message: string }) => {
      const messageData = JSON.parse(x.message);
      messageData.shape.id = x.id;
      
      return messageData.shape;
    });
  }