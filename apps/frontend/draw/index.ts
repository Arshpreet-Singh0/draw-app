import { HTTP_BACKEND } from "@/Config";
import axios from "axios";

type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: number,
  socket: WebSocket
) {
  const existingShapes: Shape[] = await getExistingShapes(roomId);

  const ctx = canvas.getContext("2d");

  if (!ctx) return;
  clearCanvas(existingShapes, canvas, ctx);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  let startX = 0,startY = 0;

  let clicked = false;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const rect = canvas.getBoundingClientRect();
    const width = e.clientX - rect.left - startX;
    const height = e.clientY - rect.top - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      })
    );

    clearCanvas(existingShapes, canvas, ctx);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(existingShapes, canvas, ctx);

      ctx.strokeStyle = "rgba(255, 255, 255)";
      // @ts-ignore
      // const selectedTool = window.selectedTool;
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

const clearCanvas = (
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    console.log(shape.type === "rect");

    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
};

async function getExistingShapes(roomId: number) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);

  const messages = res.data.chats;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}
