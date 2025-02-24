import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import userRouter from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cateRouter from "./routes/categoriesRoute.js";
import path from "path";
import Product from "./models/product.model.js";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Order from "./models/order.model.js";
import cors from "cors";
import session from "express-session";
import cartRouter from "./routes/cartRoute.js";
import checkOut from "./routes/checkOut.js";
import getUserById from "./routes/userfindidRoute.js";
import orderRouter from "./routes/orderRoute.js";
import Orderouter from "./routes/orderstatusRoute.js";
import billRouter from "./routes/billRoute.js";
import chartRoute from "./routes/chartRoute.js";
import orderFilterRoute from "./routes/orderFilterRoute.js";
import payRouter from "./routes/paymentRoute.js";
import bcrypt from "bcryptjs";
import queryRouter from "./routes/queryRoute.js";
import aiRoute from "./routes/aiRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    secret: "rasengan",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 30 * 60 * 1000 },
  })
);

app.use("/users", userRouter);
app.use("/products", productRoute);
app.use("/categories", cateRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkOut);
app.use("/api/users", getUserById);
app.use("/orders", orderRouter);
app.use("/order", Orderouter);
app.use("/bill",billRouter);
app.use("/sales",chartRoute);
app.use("/filter",orderFilterRoute);
app.use("/api/payment",payRouter);
app.use("/query",queryRouter);
app.use("/ai",aiRoute);

app.post("/:userId/change-password", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Validate new password strength
    if (
      newPassword.length < 8 ||
      !/\d/.test(newPassword) ||
      !/[A-Z]/.test(newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters long, include a number, and an uppercase letter.",
      });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    // Update the user's password
    user.password = newPassword; // This triggers the `pre('save')` middleware to hash the password
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate("cartItems.productId") // Populate product details
      .sort({ createdAt: -1 }); // Optional: Sort by latest order
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:orderId", async (req, res) => {
  try {
    // Find the order by orderId
    const order = await Order.findById(req.params.orderId)
      .populate("userId", "firstname lastname email") // Optionally, populate user details
      .populate("cartItems.productId"); // Populating product details in the order

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUser(email, password);

    if (!user) {
      return res.status(401).json({
        auth: false,
        message: "Invalid email or password", // Updated error message
      });
    }

    return res.json({
      auth: true,
      firstname: user.firstname,
      role: user.role,
      userId: user._id,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      auth: false,
      message: "Internal server error",
    });
  }
});

app.get("/hassignned", (req, res) => {
  if (req.session.user) {
    res.json({
      auth: true,
      message: "You Are Signned Successfully",
    });
  } else {
    res.json({
      auth: false,
      message: "You Are Not Signed In",
    });
  }
});

app.get("/signout", (req, res) => {
  req.session.destroy();
  res.json({
    auth: false,
  });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/productget", async (req, res) => {
  try {
    const { category } = req.query; // Get the 'category' query parameter
    const query = category ? { productCategory: category } : {}; // Filter if category is provided
    const products = await Product.find(query); // Fetch products from the database
    res.status(200).json(products); // Send the products as the response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
