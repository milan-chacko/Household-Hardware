import express from 'express';
import mongoose from 'mongoose';
const cartRouter = express.Router();
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Route to add a product to the cart
cartRouter.post("/", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the product exists and has sufficient quantity
    const product = await Product.findById(productId).session(session);

    if (!product || product.quantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Insufficient stock or product not found." });
    }

    // Check if the product is already in the user's cart
    let cartItem = await Cart.findOne({ userId, productId }).session(session);

    if (cartItem) {
      // Update the cart item quantity
      cartItem.quantity += quantity;
      await cartItem.save({ session });
    } else {
      // Create a new cart item
      cartItem = new Cart({ userId, productId, quantity });
      await cartItem.save({ session });
    }

    // Decrement the product's quantity
    product.quantity -= quantity;
    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to get all cart items for a specific user
cartRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



cartRouter.put('/updateStock/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add the returned quantity back to stock
    product.quantity += quantity;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Product stock updated successfully",
      updatedStock: product.quantity
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      message: "Failed to update product stock",
      error: error.message
    });
  }
});




// Route to delete a product from the cart
cartRouter.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    // Simply delete the cart item
    const result = await Cart.findOneAndDelete({ userId, productId });
    
    if (!result) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.status(200).json({
      message: "Product removed from cart successfully"
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      message: "Failed to remove item from cart",
      error: error.message
    });
  }
});


cartRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all cart items for the given userId
    const result = await Cart.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No cart items found for the user." });
    }

    res.status(200).json({
      message: "All products removed from cart successfully"
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear the cart",
      error: error.message
    });
  }
});

export default cartRouter;