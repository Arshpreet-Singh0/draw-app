"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

const Canvas = ({ socket, roomId }: { socket: WebSocket; roomId: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);
  return (
    <div className="h-[100vh] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth} height={window.innerHeight}
        className="bg-black h-full w-full"
      ></canvas>
    </div>
  );
};

export default Canvas;
