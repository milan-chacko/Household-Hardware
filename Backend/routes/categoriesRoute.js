import express from "express";
import Category from "../models/categories.model.js";
import multer from "multer";
import path from "path";
import Product from "../models/product.model.js";
                    
const cateRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// Add a category
cateRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, description, image });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error saving category", error });
  }
});

// Get all categories
cateRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

cateRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category to get its name before deleting
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all products that have the same category name
    await Product.deleteMany({
      productCategory: deletedCategory.name,
    });

    res
      .status(200)
      .json({ message: "Category and related products deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category and products", error });
  }
});

export default cateRouter;
