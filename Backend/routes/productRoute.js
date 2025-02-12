import Product from "../models/product.model.js";
import express from "express";
import multer  from 'multer';

const productRoute = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Define upload directory
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

productRoute.post("/",  upload.single("productImage"),async (req, res) =>{
    try {
        // Extract text fields from the request body
        const { productName, productPrice, productDescription, productCategory, quantity} = req.body;
    
        // Create a new product document
        const newProduct = new Product({
          productName,
          productPrice: Number(productPrice), // Ensure price is a number
          productDescription,
          productCategory,
          quantity,
          productImage: req.file ? req.file.path : null, // Save the file path if uploaded
        });
    
        // Save the product to the database
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Error saving product", error });
      }
    });

productRoute.get("/",async(req,res) =>{
    try{
        const productData = await Product.find();
        if(!productData){
            return res.status(404).json({message:"No Product"});
        }
        res.status(200).json(productData);
    }catch(error){
        res.status(500).json({ message: "Failed to get products", error });
    }

});

productRoute.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { productPrice, productDescription, quantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productPrice, productDescription, quantity },
      { new: true, runValidators: true } // Return updated document and validate input
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product." });
  }
});

productRoute.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
});

export default productRoute;