import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (token exists)
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const linkClass = (path) =>
    `hover:text-blue-400 transition-colors ${
      location.pathname === path ? "text-blue-400 font-semibold" : ""
    }`;

  return (
    <nav className="flex flex-wrap items-center justify-between px-8 py-4 text-white bg-gray-900 shadow-md">
      {/* Logo / Home */}
      <h1
        className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300"
        onClick={() => navigate("/")}
      >
        🛍 Mock E-Com Cart
      </h1>

      {/* Navigation Links */}
      <div className="flex flex-wrap items-center space-x-6">
        <Link to="/" className={linkClass("/")}>
          Products
        </Link>

        <Link to="/add-product" className={linkClass("/add-product")}>
          Add Product
        </Link>

        <Link to="/cart" className={linkClass("/cart")}>
          Cart
        </Link>

        {/* 🧾 New “All Orders” link */}
        <Link to="/orders" className={linkClass("/orders")}>
          📦 All Orders
        </Link>

        {/* Auth Controls */}
        {!user ? (
          <>
            <Link to="/login" className={linkClass("/login")}>
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
