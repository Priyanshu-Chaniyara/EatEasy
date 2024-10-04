import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';



//app config
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//API endpoints
app.use("/api/food",foodRouter);

app.get("/",(req,res)=>{
res.send("API Working");
})

app.listen(port,()=>{
    console.log(`Server started on https://localhost:${port}`);
})

//mongodb+srv://priyanshu:9054442111@cluster0.inyvt.mongodb.net/?