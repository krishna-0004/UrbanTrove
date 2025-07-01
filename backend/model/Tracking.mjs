import mongoose from "mongoose";

const TRACKING_STATUSES = [
  "ordered",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "returned",
  "cancelled"
];

const trackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: TRACKING_STATUSES,
    required: true
  },
  location: { type: String },
  message: { type: String },
  timestamp: {
    type: Date,
    default: Date.now
  }
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
    enum: TRACKING_STATUSES,
    default: "ordered"
  },
  history: {
    type: [trackingEventSchema],
    default: []
  },
  trackingUrl: { type: String }
}, {
  timestamps: true
});

// Static helper to add new tracking event
trackingSchema.statics.addTrackingEvent = async function(orderId, userId, { status, location, message, trackingUrl }) {
  const tracking = await this.findOne({ orderId });
  const newEvent = { status, location, message };

  if (tracking) {
    tracking.currentStatus = status;
    tracking.history.push(newEvent);
    if (trackingUrl) tracking.trackingUrl = trackingUrl;
    await tracking.save();
    return tracking;
  } else {
    const newTracking = await this.create({
      orderId,
      userId,
      currentStatus: status,
      trackingUrl,
      history: [newEvent]
    });
    return newTracking;
  }
};

export default mongoose.model("Tracking", trackingSchema);
