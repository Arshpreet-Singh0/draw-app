import { useEffect, useState } from "react";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNmNiMjdlNi1hNGY3LTRlOTItYWI5YS0xNzViYmMwNDZjODYiLCJpYXQiOjE3Mzc1NDY1MDh9.Qyju4M69-n69USSwuVfNvnswUWyHJbAtFQRA4fZOpzM");
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}