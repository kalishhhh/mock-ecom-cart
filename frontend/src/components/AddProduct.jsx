import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/products", formData);
      if (res.status === 201) {
        setMessage("✅ Product added successfully!");
        setFormData({ name: "", price: "", image: "", expiryDate: "" });
      }
    } catch (err) {
      console.error("Add product error:", err);
      setMessage("❌ Failed to add product");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="mb-6 text-3xl font-bold">Add a New Product</h1>
      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-4 bg-gray-800 shadow-lg rounded-2xl w-96"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 text-white bg-gray-700 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 text-white bg-gray-700 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 text-white bg-gray-700 rounded"
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full p-2 text-white bg-gray-700 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      {message && (
        <p className="mt-4 text-lg">
          {message}
        </p>
      )}
    </div>
  );
}

export default AddProduct;
