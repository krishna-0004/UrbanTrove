import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    sku: { type: String, required: true },
    variant: {
      size: { type: String },
      color: { type: String },
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAddTime: { type: Number, required: true }, // snapshot of price
    image: { type: String, required: true },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: {
    type: [cartItemSchema],
    default: [],
  },
  totalAmount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cart", cartSchema);
