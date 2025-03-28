"use client";

import { useEffect, useState } from "react"
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/Config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RoomCanvas({roomId} : {
    roomId : number,
}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

    if(!token){
        toast.error("Please login to continue");
        router.push("/signin");
    }
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            ws.send(data);
        }
        
    }, [router, roomId])

    if(!socket){
        return <div>
            connecting to server........
        </div>
    }
    
    return (
        <Canvas socket={socket} roomId={roomId}/>
    )
}