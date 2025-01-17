"use client";

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};


export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreateRoom = async()=>{
    console.log(name);
    
    try {
      const res = await axios.post("http://localhost:3001/room", {name},{
        headers : {
          "authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNmNiMjdlNi1hNGY3LTRlOTItYWI5YS0xNzViYmMwNDZjODYiLCJpYXQiOjE3MzcxMTU3NjV9.W6y5EOF9NQk_yfv3_6wy-GpDE5gDzu2ITbWsvRL_HNo"
        }
      } );

      router.push(`/room/${res?.data?.id}`)
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <input type="text" onChange={(e)=>setName(e.target.value)} className="border"/>

      <button className="border rounded-lg bg-blue-500 m-10" onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}
