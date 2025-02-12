import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import Order from "../models/order.model.js"; // Import your Order model

dotenv.config();
const payRouter = express.Router();

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Create Razorpay Order (before payment)
payRouter.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Convert ₹ to paisa
      currency: currency || "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 🔹 Verify Razorpay Payment (after successful transaction)
payRouter.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, cartItems, totals } = req.body;

    // ✅ Step 1: Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // ✅ Step 2: Compare with received signature
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature, payment failed" });
    }

    // ✅ Step 3: Payment verified - Save order in MongoDB
    const newOrder = new Order({
      userId,
      cartItems,
      totals,
      paymentMethod: "Online Payment",
      status: "ORDER PLACED",
      orderedAt: new Date(),
    });

    await newOrder.save();

    res.json({ success: true, message: "Payment verified & order placed" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

export default payRouter;
