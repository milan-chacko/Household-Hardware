import express from "express";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const billRouter = express.Router();

billRouter.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate({
      path:"cartItems.productId",
      model: "Product",
  });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

billRouter.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default billRouter;
