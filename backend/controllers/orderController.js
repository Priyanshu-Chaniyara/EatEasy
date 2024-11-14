/*import orderModel from "../models/orderModel.js";
import userModel from "../models/orderModel.js"
import Stripe from "stripe"

//const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from frontend
const placeOrder=async(req,res)=>{

    const frontend_url="http://localhost:5173";

  try {
    const newOrder=new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address
    })
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

    const line_items=req.body.items.map((item)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
        },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session=await stripe.checkout.session.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({success:true,session_url:session.url})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

export {placeOrder}*/

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url =
    "https://frontendtomato-g3lys5ufm-diya-baniks-projects.vercel.app";

  try {
    // Create a new order in your database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Calculate the total amount in smallest currency unit (e.g., paise for INR)
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    // Sum the total amount of all items
    const totalAmount = line_items.reduce((total, item) => {
      return total + item.price_data.unit_amount * item.quantity;
    }, 0);

    // Add delivery charges
    const deliveryCharges = 2 * 100 * 80; // Fixed delivery charge
    const finalAmount = totalAmount + deliveryCharges;

    // Create an order in Razorpay
    const options = {
      amount: finalAmount, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${newOrder._id}`,
      payment_capture: 1, // Auto capture payment
    };

    // const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      // order_id: razorpayOrder.id,
      amount: finalAmount,
      currency: "INR",
      // key_id: process.env.RAZORPAY_KEY_ID,
      name: "Food Delivery App",
      description: "Tasty & Healthy Foods",
      prefill: {
        name: req.body.userName, // Add more prefill details if needed
        email: req.body.userEmail,
        contact: req.body.userContact,
      },
      notes: {
        orderId: newOrder._id.toString(),
      },
      theme: {
        color: "#F37254",
      },
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//** Listing orders for admin panel **/
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
