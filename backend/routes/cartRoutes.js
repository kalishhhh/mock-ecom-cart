import express from "express";
import Cart from "../models/Carts.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * 🛒 Add item to cart (or increase quantity by 1)
 */
router.post("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create a cart
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    // Check if item already exists in the cart
    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({ message: "✅ Item added to cart", cart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

/**
 * 🛍 Get cart contents
 */
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.productId");
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

/**
 * ➕➖ Change quantity of an item
 */
router.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body; // +1 or -1

    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [] });

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += change;

      // Remove item if quantity <= 0
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    } else if (change > 0) {
      // Add if not present and increasing
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({ message: "✅ Quantity updated", cart });
  } catch (error) {
    console.error("❌ Error changing quantity:", error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

/**
 * 🗑 Remove a specific item from cart
 */
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    res.json({ message: "✅ Item removed", cart });
  } catch (error) {
    console.error("❌ Error removing item:", error);
    res.status(500).json({ message: "Error removing item" });
  }
});

/**
 * 🧹 Clear entire cart
 */
router.delete("/", async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "🧹 Cart cleared" });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

export default router;
