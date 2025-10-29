import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // single image for now
  expiryDate: { type: Date }, // expiry timestamp
});

const Product = mongoose.model("Product", productSchema);

export default Product;
