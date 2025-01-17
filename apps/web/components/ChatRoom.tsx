import axios from "axios"
import {ChatRoomClient} from "./ChatRoomClient";

async function getChats(id : number) {
    const res = await axios.get(`http://localhost:3001/chats/${id}`);
    console.log(res);
    
    return res.data.chats;
}

export default async function ChatRoom({id} : {
    id : number
}){
    const messages = await getChats(id);
    return (
        <div>
            <ChatRoomClient messages={messages} id={id}/>
        </div>
    )
}