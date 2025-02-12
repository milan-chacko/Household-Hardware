import express from 'express';
import Order from "../models/order.model.js";

const Orderouter = express.Router();

// GET orders by status
Orderouter.get("/admin/orders", async (req, res) => {
    try {
      const orders = await Order.find({ status: "ORDER PLACED" })
        .populate("userId", "firstname lastname address location phonenumber") // Fetch user details
        .populate("cartItems.productId", "productName productImage  productCategory"); // Fetch product details (name and image)
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  Orderouter.put("/admin/orders/reject/:id", async (req, res) => {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }
  
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { 
          status: "ORDER REJECTED",
          rejectionReason: rejectionReason,
        },
        { new: true }
      )
        .populate("userId", "firstname lastname")
        .populate("cartItems.productId", "name image");
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error rejecting the order." });
    }
  });
  
// PATCH update order status
Orderouter.put("/admin/orders/:id", async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "ORDER DISPATCHED" ,
          dispatchedAt : new Date()
        },
        { new: true }
      )
        .populate("userId", "firstname lastname ")
        .populate("cartItems.productId", "name image");
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  });


  Orderouter.get("/admin/dispatched-orders", async (req, res) => {
    try {
      const orders = await Order.find({ status: "ORDER DISPATCHED" })
        .populate("userId", "firstname lastname address location phonenumber") // Fetch user details
        .populate("cartItems.productId", "productName productImage  productCategory"); // Fetch product details (name and image)
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  Orderouter.patch("/admin/update-status/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status:"ORDER DELIVERD" ,
          deliveredAt: new Date()
        },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }
      res.status(200).send(updatedOrder);
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  });
  

  Orderouter.get("/api/orders", async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : { status: "ORDER DELIVERD" }; // Default to "ORDER DELIVERED"
    
    try {
      const orders = await Order.find({status: "ORDER DELIVERD"})
      .populate("userId", "firstname lastname address location phonenumber") // Fetch user details
        .populate("cartItems.productId", "productName productImage  productCategory"); // Fetch product details (name and image)
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });


  Orderouter.get("/api/orders/count", async (req, res) => {
    try {
      // Get counts for different order statuses
      const newOrdersCount = await Order.countDocuments({ status: "ORDER PLACED" });
      const dispatchedOrdersCount = await Order.countDocuments({ status: "ORDER DISPATCHED" });
      const deliveredOrdersCount = await Order.countDocuments({ status: "ORDER DELIVERD" });
  
      // Return counts as response
      res.status(200).json({
        newOrders: newOrdersCount,
        dispatchedOrders: dispatchedOrdersCount,
        deliveredOrders: deliveredOrdersCount,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch order counts" });
    }
  });
  
  
export default Orderouter;
