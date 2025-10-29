🛒 Mock E-Commerce Cart

A full-stack MERN (MongoDB, Express, React, Node.js) application that simulates an online shopping experience — users can sign up, log in, browse products, add/remove items from the cart, and place orders.

🚀 Features

✅ User Authentication – Signup, Login, and JWT-based session handling
✅ Product Management – Add, view, and manage products
✅ Cart System – Add/remove products, adjust quantities
✅ Order System – Checkout and view past orders
✅ Admin Tools – Add products (for demo purposes)
✅ Responsive UI – Built using React + Tailwind CSS
✅ REST API Backend – Node.js, Express, and MongoDB

🧩 Project Structure
mock-ecom-cart/
│
├── backend/                # Node.js + Express backend
│   ├── models/             # MongoDB models (User, Product, Cart, Order)
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth & token validation
│   ├── uploads/            # Image uploads folder
│   ├── server.js           # Main backend entry
│   ├── seed.js             # For seeding demo data
│   ├── .env                # Environment variables
│   ├── package.json
│   └── ...
│
├── frontend/               # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # All React components
│   │   │   ├── AddProduct.jsx
│   │   │   ├── cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── Signup.jsx
│   │   ├── api.js          # Axios base instance
│   │   ├── App.jsx         # Main app entry
│   │   ├── AuthContext.jsx # Global auth state
│   │   ├── main.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── ...
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/kalishhhh/mock-ecom-cart.git
cd mock-ecom-cart

2️⃣ Backend setup
cd backend
npm install


Create a .env file inside backend/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run start


(You should see: Backend running on port 5000)

3️⃣ Frontend setup
cd ../frontend
npm install


Run frontend:

npm run dev


Then visit the local URL (usually http://localhost:5173).

🔗 API Endpoints
Endpoint	Method	Description
/api/auth/signup	POST	Register new user
/api/auth/login	POST	Login existing user
/api/products	GET	Get all products
/api/cart	GET/POST/DELETE	Manage cart
/api/orders	GET/POST	Place or view orders
🧠 Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, Context API

Backend: Node.js, Express.js, Mongoose, JWT, Bcrypt

Database: MongoDB Atlas

Version Control: Git + GitHub

📦 Deployment (optional)

You can deploy using:

Frontend: Vercel
 or Netlify

Backend: Render
 or Railway

Database: MongoDB Atlas

✨ Author

👤 Ishit Kalia (kalishhhh)
🔗 GitHub Profile
