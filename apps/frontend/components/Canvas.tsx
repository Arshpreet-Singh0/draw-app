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
    <div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="bg-black"
      ></canvas>
    </div>
  );
};

export default Canvas;
