import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Carts.js";

const router = express.Router();

// ✅ Checkout Route
router.post("/checkout", async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne().populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    // ✅ Create new order matching schema
    const order = new Order({
      user: userId, // ✅ field name matches schema
      items: cart.items.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
      })),
      totalPrice, // ✅ matches schema
      date: new Date(),
    });

    await order.save();

    // ✅ Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.json({ message: "✅ Checkout successful", order });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
});


// ✅ Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
