import mongoose from "mongoose";

const cancelRequestSchema = new mongoose.Schema({
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
    ref: "Product"
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["requested", "approved", "rejected", "cancelled"],
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
  }
});

export default mongoose.model("CancelRequest", cancelRequestSchema);
