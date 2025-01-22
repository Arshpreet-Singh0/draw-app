import RoomCanvas from "@/components/RoomCanvas";

export default async function page({params} : {
    params : Promise<{
        id : number,
    }>
}){

    const roomId = (await params).id;

    return (
        <>
        <RoomCanvas roomId={roomId}/>
        </>
    )
}