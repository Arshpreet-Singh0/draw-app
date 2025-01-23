"use client";

import { useEffect, useRef, useState } from "react"
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/Config";

export default function RoomCanvas({roomId} : {
    roomId : number,
}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)

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