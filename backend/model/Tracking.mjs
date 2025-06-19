import mongoose from "mongoose";

const trackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["ordered", "packed", "shipped", "out-for-delivery", "delivered", "returned", "cancelled"],
    required: true
  },
  location: { type: String },
  message: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const trackingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  currentStatus: {
    type: String,
    enum: ["ordered", "packed", "shipped", "out-for-delivery", "delivered", "returned", "cancelled"],
    default: "ordered"
  },
  history: [trackingEventSchema],
  trackingUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model("Tracking", trackingSchema);
