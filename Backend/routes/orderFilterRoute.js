import express from "express";
import Order from "../models/order.model.js";

const orderFilterRoute = express.Router();

// Route to fetch all orders
// Route to fetch all orders
orderFilterRoute.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .populate("cartItems.productId", "productName productPrice productImage");  // Include 'image' field
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Route to fetch order by ID
  orderFilterRoute.get("/orders/filter/:orderId", async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("userId", "name email")
        .populate("cartItems.productId", "productName productPrice productImage");  // Include 'image' field
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

export default orderFilterRoute;
