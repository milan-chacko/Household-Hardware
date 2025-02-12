import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User", // Assuming you have a User model
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
      required: true,
      ref: "Product", // Assuming you have a Product model
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensure at least 1 quantity
    },
    status: {
        type: String,
        required: true,
        default:"oncart",
    },
    dateAdded: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the Cart model
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
