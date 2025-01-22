"use client";

import { useEffect, useRef, useState } from "react"
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/Config";

export default function RoomCanvas({roomId} : {
    roomId : number,
}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNmNiMjdlNi1hNGY3LTRlOTItYWI5YS0xNzViYmMwNDZjODYiLCJpYXQiOjE3Mzc1NDY1MDh9.Qyju4M69-n69USSwuVfNvnswUWyHJbAtFQRA4fZOpzM`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            ws.send(data);
        }
        
    }, [])

    if(!socket){
        return <div>
            connecting to server........
        </div>
    }
    
    return (
        <Canvas socket={socket} roomId={roomId}/>
    )
}