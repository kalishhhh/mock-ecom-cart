import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [purchaseTime, setPurchaseTime] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const changeQuantity = async (productId, change) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${productId}`, { change });
      await fetchCart();
    } catch (err) {
      console.error("Error changing quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart");
      fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ Checkout: Save order + clear cart + show animation + timestamp
  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        alert("⚠️ Please log in before checking out!");
        return;
      }

      const items = cart.items.map((item) => ({
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      }));

      // ✅ Send userId with order data
      const res = await axios.post("http://localhost:5000/api/orders/checkout", {
        items,
        userId: user._id,
      });

      console.log("✅ Order saved:", res.data);

      // Clear cart after checkout
      await axios.delete("http://localhost:5000/api/cart");

      // 🎉 Show animation
      setPurchased(true);
      setPurchaseTime(new Date().toLocaleString());
      setTimeout(() => {
        setPurchased(false);
        fetchCart();
      }, 4000);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Checkout failed");
    }
  };

  if (loading) {
    return <div className="mt-10 text-center text-white">Loading...</div>;
  }

  if (!cart.items.length && !purchased) {
    return (
      <div className="mt-10 text-center text-white">
        Your cart is empty 🛒
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-center">Your Cart</h1>

      {/* ✅ Purchase Animation */}
      {purchased ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="relative w-24 h-24">
            <div className="absolute w-24 h-24 border-8 border-green-400 rounded-full border-t-transparent animate-spin"></div>
            <svg
              className="absolute inset-0 w-16 h-16 m-auto text-green-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-400">
            Purchase Successful!
          </h2>
          {purchaseTime && (
            <p className="text-gray-400">Purchased on: {purchaseTime}</p>
          )}
          <Link
            to="/orders"
            className="px-4 py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            View All Orders
          </Link>
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-2xl"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.productId.images?.[0]
                        ? `http://localhost:5000${item.productId.images[0]}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.productId.name}
                    className="object-cover w-20 h-20 rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.productId.name}</h2>
                    <p className="text-gray-400">₹{item.productId.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => changeQuantity(item.productId._id, -1)}
                    className="px-3 py-1 text-lg text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    -
                  </button>

                  <span className="text-lg font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => changeQuantity(item.productId._id, 1)}
                    className="px-3 py-1 text-lg text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="px-3 py-1 ml-3 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl p-4 mx-auto mt-6 bg-gray-800 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xl font-semibold">
              <span>Total: ₹{totalPrice}</span>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
