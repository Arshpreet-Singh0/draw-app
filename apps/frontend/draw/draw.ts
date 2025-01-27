import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      id? : number,
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color : string;
      strokWidth : number;
    }
  | {
      id? : number,
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      color : string;
      strokWidth : number;
    }
  | {
      id? : number,
      type: "pencil";
      points: { x: number; y: number }[];
      color : string;
      strokWidth : number;
    };

export class Draw{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: number;
    private clicked: boolean;
    private strokColor : string;
    private strokWidth : number;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "";
    private currentPencilStroke: { x: number; y: number }[] = [];

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.strokWidth = 1;
        this.strokColor = "rgba(255, 255, 255)"
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    

    setTool(tool: "circle" | "pencil" | "rectangle" | "eraser" | "") {
        this.selectedTool = tool;
    }
    setStrokColor(color : string) {
        this.strokColor = color;
    }
    setStrokWidth(width : number) {
        this.strokWidth = width;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            console.log(message);
            if (message.type === "chat") {
              const parsedShape = JSON.parse(message.message);
              parsedShape.shape.id = message.id;
        
              this.existingShapes.push(parsedShape.shape);
              this.clearCanvas();
            }
            if(message.type === "delete"){
                
              
              const chatId = message.chatId;
              
              const idx = this.existingShapes.findIndex((shape)=>{
                return shape.id==chatId;
                
              });
        
              if(idx!=-1){
                this.existingShapes.splice(idx, 1);
                this.clearCanvas();
              }
              
            }
            if(message.type=="clearscreen"){
              this.existingShapes = [];
              this.clearCanvas();
            }
          };
        
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)

        this.canvas.removeEventListener("click", this.mouseClickHandler)
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
        this.ctx.strokeStyle = shape.color;
        this.ctx.lineWidth = shape.strokWidth;

        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
        this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = shape.strokWidth;
      this.ctx.beginPath();
      this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil") {
        this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = shape.strokWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points?.[0].x, shape.points?.[0].y);

      for (let i = 1; i < shape?.points?.length; i++) {
        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }

      this.ctx.stroke();
      this.ctx.closePath();
    }
  });
    }

    mouseDownHandler = (e : MouseEvent)=>{
        this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.ctx.moveTo(this.startX, this.startY);

    // Reset pencil stroke
    this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
    }

    mouseUpHandler = (e:MouseEvent)=>{
        this.clicked = false;
        
            const rect = this.canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
        
            const selectedTool: Tool = this.selectedTool;
            const strokColor =this.strokColor;
            const strokWidth = this.strokWidth;
        
            let shape: Shape | null = null;
        
            if (selectedTool === "rectangle") {
              const width = endX -this. startX;
              const height = endY - this.startY;
              shape = { type: "rect", x: this.startX, y: this.startY, width, height, color : strokColor, strokWidth };
            } else if (selectedTool === "circle") {
              const radius = Math.max(Math.abs(endX - this.startX), Math.abs(endY - this.startY)) / 2;
              const centerX = this.startX + (endX - this.startX) / 2;
              const centerY = this.startY + (endY - this.startY) / 2;
              shape = { type: "circle", centerX, centerY, radius, color : strokColor, strokWidth };
            } else if (selectedTool === "pencil" && this.currentPencilStroke.length > 1) {
              shape = { type: "pencil", points: [...this.currentPencilStroke] , color : strokColor, strokWidth};
            }
        
            if (shape) {
              // Send the shape via WebSocket
              this.socket.send(
                JSON.stringify({
                  type: "chat",
                  message: JSON.stringify({ shape }),
                  roomId : this.roomId,
                })
              );
        
              this.clearCanvas();
            }
        
            // Reset pencil stroke
            this.currentPencilStroke = [];
    }

    mouseMoveHandler = (e:MouseEvent)=>{
        if (!this.clicked) return;
        
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
        
            const selectedTool: Tool = this.selectedTool;
            const strokColor =this.strokColor;
            const strokWidth = this.strokWidth;
        
            this.ctx.strokeStyle = strokColor
            this.ctx.lineWidth = strokWidth;
            if (selectedTool === "rectangle") {
              const width = currentX - this.startX;
              const height = currentY - this.startY;
        
              this.clearCanvas();
              this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
              const radius = Math.max(Math.abs(currentX - this.startX), Math.abs(currentY - this.startY)) / 2;
              const centerX = this.startX + (currentX - this.startX) / 2;
              const centerY = this.startY + (currentY - this.startY) / 2;
        
              this.clearCanvas();
              this.ctx.beginPath();
              this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.closePath();
            } else if (selectedTool === "pencil") {
              this.currentPencilStroke.push({ x: currentX, y: currentY });
        
              this.clearCanvas();
              this.ctx.beginPath();
              this.ctx.moveTo(this.currentPencilStroke[0].x, this.currentPencilStroke[0].y);
        
              for (let i = 1; i < this.currentPencilStroke.length; i++) {
                this.ctx.lineTo(this.currentPencilStroke[i].x, this.currentPencilStroke[i].y);
              }
        
              this.ctx.stroke();
              this.ctx.closePath();
            }
    }

    mouseClickHandler = (e : MouseEvent)=>{


    if(!(this.selectedTool==="eraser")) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    // Find the shape that was clicked
    const shapeIndex = this.existingShapes.findIndex((shape) => {
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
        return shape?.points?.some(
          (point : any) =>
            Math.abs(point.x - mouseX) < 10 && Math.abs(point.y - mouseY) < 10
        );
      }
      return false;
    });
  
    if (shapeIndex !== -1) {
      // // Remove the clicked shape
    //   this.existingShapes.splice(shapeIndex, 1);
  
      // // Redraw the canvas without the removed shape
    //   this.clearCanvas();

    console.log(this.existingShapes[shapeIndex]?.id,);
    
  
      this.socket.send(
        JSON.stringify({
          type: "delete",
          chatId : this.existingShapes[shapeIndex]?.id,
          roomId : this.roomId,
        })
      );
    }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)  
        
        this.canvas.addEventListener("click", this.mouseClickHandler);

    }

}