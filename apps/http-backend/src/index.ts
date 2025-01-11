import express from "express";
const app = express();
import authRouter from './routes/auth.routes';
import { isAuthenticated } from "./middlewares/isAuthenticated";

app.use(express.json());

app.get('/room', isAuthenticated, (req, res)=>{
    res.json({
        id : "1234",
    })
});

app.use('/', authRouter);


app.listen(3001, ()=>{
    console.log("listening to port 3000");  
})