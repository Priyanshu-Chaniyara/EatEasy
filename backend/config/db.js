import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://priyanshu:9054442111@cluster0.inyvt.mongodb.net/EatEasy').then(()=>console.log("Database Connected")); 
}
