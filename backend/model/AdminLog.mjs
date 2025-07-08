import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: { type: String },
  userAgent: { type: String } 
});

export default mongoose.model("AdminLog", adminLogSchema);
