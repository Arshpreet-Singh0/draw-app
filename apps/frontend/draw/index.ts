import { Tool } from "@/components/Canvas";
import { HTTP_BACKEND } from "@/Config";
import axios from "axios";

type Shape =
  | {
      id? : number,
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      id? : number,
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      id? : number,
      type: "pencil";
      points: { x: number; y: number }[];
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
    
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      parsedShape.shape.id = message.id;

      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
    if(message.type === "delete"){
      console.log(message);
      console.log(existingShapes);
      
      
      const chatId = message.chatId;
      
      const idx = existingShapes.findIndex((shape)=>{
        return shape.id==chatId;
        
      });

      if(idx!=-1){
        existingShapes.splice(idx, 1);
        clearCanvas(existingShapes ,canvas, ctx);
      }
      
      

    }
  };

  let startX = 0,
    startY = 0;
  let clicked = false;
  let currentPencilStroke: { x: number; y: number }[] = [];

  // Mouse down handler
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    ctx.moveTo(startX, startY);

    // Reset pencil stroke
    currentPencilStroke = [{ x: startX, y: startY }];
  });

  // Mouse up handler
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool: Tool = window.selectedTool;

    let shape: Shape | null = null;

    if (selectedTool === "rectangle") {
      const width = endX - startX;
      const height = endY - startY;
      shape = { type: "rect", x: startX, y: startY, width, height };
    } else if (selectedTool === "circle") {
      const radius = Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;
      const centerX = startX + (endX - startX) / 2;
      const centerY = startY + (endY - startY) / 2;
      shape = { type: "circle", centerX, centerY, radius };
    } else if (selectedTool === "pencil" && currentPencilStroke.length > 1) {
      shape = { type: "pencil", points: [...currentPencilStroke] };
    }

    if (shape) {
      // Send the shape via WebSocket
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );

      clearCanvas(existingShapes, canvas, ctx);
    }

    // Reset pencil stroke
    currentPencilStroke = [];
  });

  // Mouse move handler
  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool: Tool = window.selectedTool;

    if (selectedTool === "rectangle") {
      const width = currentX - startX;
      const height = currentY - startY;

      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
    } else if (selectedTool === "circle") {
      const radius = Math.max(Math.abs(currentX - startX), Math.abs(currentY - startY)) / 2;
      const centerX = startX + (currentX - startX) / 2;
      const centerY = startY + (currentY - startY) / 2;

      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (selectedTool === "pencil") {
      currentPencilStroke.push({ x: currentX, y: currentY });

      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.beginPath();
      ctx.moveTo(currentPencilStroke[0].x, currentPencilStroke[0].y);

      for (let i = 1; i < currentPencilStroke.length; i++) {
        ctx.lineTo(currentPencilStroke[i].x, currentPencilStroke[i].y);
      }

      ctx.stroke();
      ctx.closePath();
    }
  });

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    // Find the shape that was clicked
    const shapeIndex = existingShapes.findIndex((shape) => {
      if (shape.type === "rect") {
        return (
          mouseX >= shape.x &&
          mouseX <= shape.x + shape.width &&
          mouseY >= shape.y &&
          mouseY <= shape.y + shape.height
        );
      } else if (shape.type === "circle") {
        const dx = mouseX - shape.centerX;
        const dy = mouseY - shape.centerY;
        return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
      } else if (shape.type === "pencil") {
        return shape.points.some(
          (point) =>
            Math.abs(point.x - mouseX) < 5 && Math.abs(point.y - mouseY) < 5
        );
      }
      return false;
    });
  
    if (shapeIndex !== -1) {
      // // Remove the clicked shape
      // existingShapes.splice(shapeIndex, 1);
  
      // // Redraw the canvas without the removed shape
      // clearCanvas(existingShapes, canvas, ctx);
  
      socket.send(
        JSON.stringify({
          type: "delete",
          chatId : existingShapes[shapeIndex]?.id,
          roomId,
        })
      );
    }
    
  });
  
}

// Clear canvas and redraw shapes
const clearCanvas = (
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "pencil") {
      ctx.beginPath();
      ctx.moveTo(shape.points?.[0].x, shape.points?.[0].y);

      for (let i = 1; i < shape?.points?.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }

      ctx.stroke();
      ctx.closePath();
    }
  });
};

// Fetch existing shapes from the backend
async function getExistingShapes(roomId: number): Promise<Shape[]> {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.chats;

  return messages.map((x: { id : number, message: string }) => {
    const messageData = JSON.parse(x.message);
    messageData.shape.id = x.id;
    
    return messageData.shape;
  });
}
