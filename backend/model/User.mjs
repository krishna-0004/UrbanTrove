import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  locality: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String },
  altPhone: { type: String },
  addressType: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home"
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  googleId: { type: String },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user"
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
