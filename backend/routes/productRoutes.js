import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Add new product
router.post("/", async (req, res) => {
  try {
    const { name, price, image, expiryDate } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      price,
      image,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ Fetch all available products
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
    });
    res.json(products);
  } catch (error) {
    console.error("❌ Fetch products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;
