import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed");

    alert("✅ Added to cart successfully!");
  } catch (err) {
    alert("❌ Failed to add to cart");
    console.error(err);
  }
};


  if (loading)
    return <div className="mt-10 text-center text-white">Loading...</div>;

  if (!products.length)
    return (
      <div className="mt-10 text-center text-white">
        No products found 😞
      </div>
    );

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-center">Products</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => {
          // ✅ Smart image handler
          let imageUrl = "https://via.placeholder.com/300x200.png?text=No+Image";

          if (product.image) {
            // If image already starts with http or https, use it directly
            if (product.image.startsWith("http")) {
              imageUrl = product.image;
            } else {
              // Else assume it’s a relative path from backend (like /uploads/img.jpg)
              imageUrl = `http://localhost:5000${product.image}`;
            }
          }

          return (
            <div
              key={product._id}
              className="flex flex-col items-center p-4 bg-gray-800 shadow-lg rounded-2xl"
            >
              <img
                src={imageUrl}
                alt={product.name}
                className="object-cover w-48 h-40 mb-3 rounded-lg"
              />

              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mb-2 text-gray-400">₹{product.price}</p>

              <button
                onClick={() => addToCart(product._id)}
                className="px-4 py-2 mt-auto bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>

              <Link
                to="/cart"
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Go to Cart →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;
