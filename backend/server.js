// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

import Product from "./models/Product.js";
import Cart from "./models/Carts.js";
import Order from "./models/Order.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


// ====================================================
// ⚙️ Setup and Middleware
// ====================================================
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());



// ====================================================
// 🧩 MongoDB Connection
// ====================================================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mockEcom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));



  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ====================================================
// 🖼️ Multer Setup for Image Uploads
// ====================================================
const uploadDir = path.resolve("backend/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ✅ Make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ====================================================
// 🔐 Routes (Auth, Cart, Orders)
// ====================================================
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);


// ====================================================
// 🖼️ Upload Image Endpoint
// ====================================================
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/${path.basename(file.path)}`.replace(/\\/g, "/")
    );
    res.json({ images: imagePaths });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Error uploading images" });
  }
});

// ====================================================
// 🛍️ Product Routes
// ====================================================

// ✅ Fetch all valid (non-expired) products
app.get("/api/products", async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
    });
    res.json(products);
  } catch (err) {
    console.error("❌ Fetch Products Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image, durationHours } = req.body;

    const expiryDate = durationHours
      ? new Date(Date.now() + durationHours * 60 * 60 * 1000)
      : null;

    const newProduct = new Product({
      name,
      price,
      image,
      expiryDate,
    });

    await newProduct.save();
    res.json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ====================================================
// 💳 Checkout Route
// ====================================================
app.post("/api/checkout", async (req, res) => {
  try {
    let cart = await Cart.findOne().populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: "✅ Checkout successful", order });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    res.status(500).json({ message: "Error processing checkout" });
  }
});

// ====================================================
// 📦 Orders History Route
// ====================================================
app.get("/api/orders/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    const formatted = orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,
      totalAmount: order.totalPrice,
      items: order.items.map((i) => ({
        productName: i.productId?.name || "Deleted Product",
        quantity: i.quantity,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ====================================================
// 🚀 Start Server
// ====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
