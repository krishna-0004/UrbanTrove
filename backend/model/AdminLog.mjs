import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming admin users are part of the User model
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      "product-added",
      "product-updated",
      "product-deleted",
      "order-status-updated",
      "user-deactivated",
      "user-reactivated",
      "coupon-created",
      "coupon-deleted",
      "banner-added",
      "login"
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // flexible info: could include productId, orderId, etc.
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: { type: String }, // optional, for security auditing
  userAgent: { type: String } // optional, track browser info
});

export default mongoose.model("AdminLog", adminLogSchema);
