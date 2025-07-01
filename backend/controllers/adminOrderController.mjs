import Order from "../model/Order.mjs";
import Tracking from "../model/Tracking.mjs";
import { sendEmail } from "../util/sendEmail.mjs";
import mongoose from "mongoose";

export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;
  const skip = (page - 1) * limit;
  const query = {};

  if (search) {
    // ✅ only assign to _id if search is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(search)) {
      query._id = search;
    } else {
      // Optional: implement text-based search (e.g., user name) if needed
      return res.status(400).json({ message: "Invalid Order ID" });
    }
  }

  if (status) query.orderStatus = status;

  try {
    const [orders, total] = await Promise.all([
      Order.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }).populate("user", "name email"),
      Order.countDocuments(query)
    ]);

    res.json({
      data: orders,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get single order with tracking info
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: "Order not found" });

  const tracking = await Tracking.findOne({ orderId: order._id });

  res.json({ order, tracking });
};

// ✅ Update order status + tracking
export const updateOrderStatus = async (req, res) => {
  const { status, location, message, trackingUrl } = req.body;

  const allowed = [
    "processing", "packed", "shipped", "out-for-delivery",
    "delivered", "cancelled", "returned"
  ];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Update order document
  order.orderStatus = status;
  if (status === "delivered") order.deliveredAt = new Date();
  await order.save();

  // Update or create tracking document
  let tracking = await Tracking.findOne({ orderId: order._id });

  if (!tracking) {
    tracking = new Tracking({
      orderId: order._id,
      userId: order.user._id,
      currentStatus: status,
      history: [{ status, location, message }],
      trackingUrl: trackingUrl || ""
    });
  } else {
    tracking.currentStatus = status;
    tracking.history.push({ status, location, message });
    if (trackingUrl) tracking.trackingUrl = trackingUrl;
  }

  await tracking.save();

  // ✅ Send Email Notification
  try {
    const subject = `Your order is now ${status.toUpperCase()}`;
    const body = `
      <p>Hello ${order.user.name},</p>
      <p>Your order <strong>${order._id}</strong> status has been updated to: <strong>${status}</strong>.</p>
      ${message ? `<p><strong>Note:</strong> ${message}</p>` : ""}
      ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
      ${trackingUrl ? `<p>Track your order here: <a href="${trackingUrl}">${trackingUrl}</a></p>` : ""}
      <br/>
      <p>Thanks for shopping with us!</p>
      <p><strong>UrbanTrove Team</strong></p>
    `;

    await sendEmail({
      to: order.user.email,
      subject,
      html: body
    });
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr);
  }

  res.json({ message: "Order status updated and email sent", order, tracking });
};

