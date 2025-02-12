import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productDescription: { type: String, required: true },
  productCategory: { type: String, required: true },
  quantity:{ type: Number, required: true },
  productImage: { type: String }, // Path to the uploaded image
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
