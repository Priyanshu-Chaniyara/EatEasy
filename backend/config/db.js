import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect("YOUR DATABASE LINK HERE")
    .then(() => console.log("DB connected"));
};
