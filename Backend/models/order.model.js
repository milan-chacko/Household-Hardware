import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totals: {
    quantity: Number,
    amount: Number,
    deliveryCharge: { type: Number, default: 50 },
  },
  paymentMethod: { type: String, required: true }, // Add this field
  paymentId: { type: String }, // Razorpay Payment ID (for online payments)
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
  status: {
    type: String,
    enum: ["ORDER PLACED", "ORDER REJECTED", "ORDER DISPATCHED", "ORDER DELIVERD"],
    default: "ORDER PLACED",
  },
  rejectionReason: { type: String }, // New field for rejection reason
  orderedAt: { type: Date }, 
  dispatchedAt: { type: Date }, 
  deliveredAt: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
