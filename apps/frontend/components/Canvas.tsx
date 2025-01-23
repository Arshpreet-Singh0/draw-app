"use client";

import { initDraw } from "@/draw";
import { Circle, MousePointer2, Pencil, Plus, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Tool = "rectangle" | "circle" | "pencil" | "";

const Canvas = ({ socket, roomId }: { socket: WebSocket; roomId: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("");


  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  useEffect(()=>{
    //@ts-ignore
    window.selectedTool = selectedTool;
  },[selectedTool]);

  return (
    <div className="h-[100vh] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth} height={window.innerHeight}
        className="bg-black h-full w-full"
        // style={{ cursor: "crosshair" }}
      ></canvas>

      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
    </div>
  );
};

export default Canvas;

const Topbar = ({selectedTool, setSelectedTool} : {
  selectedTool : Tool,
  setSelectedTool : (t:Tool) => void
})=>{
  return (
    <div className="p-5 fixed top-0 w-full">

      <div className="flex gap-10 w-[50%] mx-auto p-2 rounded-lg bg-[#1e1e1e]">
        <div className=" p-3 rounded-lg" onClick={()=>setSelectedTool("rectangle")}>
          <Square className={`${selectedTool=="rectangle" ? 'text-purple-600' : 'text-white '}`} />

        </div>
        <div className=" p-3 rounded-lg" onClick={()=>setSelectedTool("circle")}>
          <Circle className={`${selectedTool=="circle" ? 'text-purple-600' : 'text-white '}`}/>

        </div>
        <div className=" p-3 rounded-lg" onClick={()=>setSelectedTool("pencil")}>
          <Pencil className={`${selectedTool=="pencil" ? 'text-purple-600' : 'text-white '}`}/>

        </div>
        <div className=" p-3 rounded-lg" onClick={()=>setSelectedTool("")}>
          <MousePointer2 className={`${selectedTool=="" ? 'text-purple-600' : 'text-white '}`}/>

        </div>

      </div>

    </div>
  )
}
