import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
  brainTreePaymentController,
  braintreeTokenController,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRoute = express.Router();

cartRoute.post("/add", authMiddleware, addToCart);
cartRoute.post("/remove", authMiddleware, removeFromCart);
cartRoute.post("/get", authMiddleware, getCart);
//payments routes
//token
cartRoute.get("/braintree/token", braintreeTokenController);

//payments
cartRoute.post(
  "/braintree/payment",
  authMiddleware,
  brainTreePaymentController
);

export default cartRoute;
