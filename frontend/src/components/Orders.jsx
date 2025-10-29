import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    if (!user || !user._id) {
      // No user logged in — reset orders
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/orders?userId=${user._id}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Runs once when component mounts

  // Reset orders if user changes (e.g. new login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) setOrders([]); // clear if logged out
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading)
    return (
      <p className="mt-10 text-center text-gray-400">Loading orders...</p>
    );

  return (
    <div className="max-w-5xl p-6 mx-auto text-white">
      <h2 className="mb-6 text-3xl font-bold text-blue-400">📦 All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="p-6 transition bg-gray-800 shadow-md rounded-xl hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Order #{orders.length - index}
                </h3>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {order.items && order.items.length > 0 ? (
                <ul className="space-y-2">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between pb-1 text-gray-300 border-b border-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        ₹
                        {item.price && item.quantity
                          ? (item.price * item.quantity).toFixed(2)
                          : "0.00"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-400">No items in this order.</p>
              )}

              <div className="flex justify-end mt-4 text-lg font-bold text-blue-400">
                Total: ₹
                {order.totalPrice
                  ? order.totalPrice.toFixed(2)
                  : "0.00"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
