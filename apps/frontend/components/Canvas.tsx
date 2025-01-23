"use client";

import { initDraw } from "@/draw";
import { Circle, Eraser, MousePointer2, Pencil, Plus, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Tool = "rectangle" | "circle" | "pencil" | "eraser" | "";

const Canvas = ({ socket, roomId }: { socket: WebSocket; roomId: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("");
  const [strokColor, setStrokColor] = useState("rgba(255, 255, 255)");
  const [strokWidth, setStrokWidth] = useState(1);


  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  useEffect(()=>{
    //@ts-ignore
    window.selectedTool = selectedTool;
    //@ts-ignore
    window.strokColor = strokColor;
    //@ts-ignore
    window.strokWidth = strokWidth;
  },[selectedTool, strokColor, strokWidth]);

  return (
    <div className="h-[100vh] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth} height={window.innerHeight}
        className="bg-black h-full w-full"
        style={{cursor : (selectedTool==="circle" || selectedTool==="rectangle" || selectedTool==="pencil") ? 'crosshair' : selectedTool==="eraser" ? '-webkit-grab' : ''}}
   
      ></canvas>

      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
      <Sidebar strokColor={strokColor} setStrokColor={setStrokColor} strokWidth={strokWidth} setStrokWidth={setStrokWidth} />
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
        <div className=" p-3 rounded-lg" onClick={()=>setSelectedTool("eraser")}>
          <Eraser className={`${selectedTool=="eraser" ? 'text-purple-600' : 'text-white '}`}/>

        </div>

      </div>

    </div>
  )
}

const Sidebar = ({strokColor, setStrokColor, strokWidth, setStrokWidth} : {strokColor:string, setStrokColor : (s:string)=>void, strokWidth:number, setStrokWidth : (s:number)=>void},)=>{
  const colors = [
    "rgba(255, 255, 255)",
    "rgba(255, 255, 0)",
    "rgba(255, 0, 0)",
    "rgba(255, 121, 118)",
    "rgba(48, 142, 64)",
    "rgba(175, 89, 0)",
    "rgba(88, 154, 224)"
  ];
  const widths = [1, 2, 5, 8, 10, 15, 20];
  return (
    <div className="fixed w-60 top-20 rounded-lg bg-[#1e1e1e] p-4 h-56">
      <div>
        <h1 className="text-white opacity-85">Strok Color</h1>

        <div className="flex gap-2 mt-2">
          {
            colors.map((color, idx)=>(
              <span style={{backgroundColor : color}} key={idx} className={`w-6 h-6 rounded-full ${strokColor==color ? 'border-2' : ''} border-white`} onClick={()=>setStrokColor(color)}>

              </span>
            ))
          }
        </div>
      </div>

      <div className="mt-5">
      <h1 className="text-white opacity-85">Strok Size</h1>
      <div className="flex flex-wrap gap-2 mt-2">
          {
            widths.map((width)=>(
              <span className={`text-white bg-[#2e2e2e] rounded px-4 py-1 ${strokWidth==width ? 'border-2' : ''} border-white`} onClick={()=>setStrokWidth(width)}>{width}</span>
            ))
          }

      </div>
      </div>
    </div>
  )
}
