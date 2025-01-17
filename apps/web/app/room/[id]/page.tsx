import ChatRoom from "../../../components/ChatRoom";
import { useSocket } from "../../../hooks/useSocket";

export default async function page({params}: {
    params : Promise<{
        id: number
    }>
}){
    const id = (await params).id;

    return (
        <div>
            <ChatRoom id={id}/>
        </div>
    )
}