import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["requested", "approved", "rejected", "picked", "refunded"],
    default: "requested"
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  refundAmount: {
    type: Number
  },
  pickupScheduled: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("ReturnRequest", returnRequestSchema);
