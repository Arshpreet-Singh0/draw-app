import RoomCanvas from "@/components/RoomCanvas";
import { HTTP_BACKEND } from "@/Config";
import axios from "axios";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

async function checkRoom(id : number){
    const res = await axios.get(`${HTTP_BACKEND}/checkroom/${id}`);
    console.log(res);
    
    
    return res?.data?.success;
 
}
export default async function page({
  params,
}: {
  params: Promise<{
    id: number;
  }>;
}) {
  const roomId = (await params).id;
  const isRoomExist = await checkRoom(roomId);

  if(!isRoomExist){
    redirect('/rooms');
  }

  if(!roomId){

  }

  return (
    <>
      <RoomCanvas roomId={roomId} />
    </>
  );
}
