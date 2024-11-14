import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(
      "DATABASE_URL"
    )
    .then(() => console.log("DB connected"));
};
