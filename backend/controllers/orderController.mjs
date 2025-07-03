import mongoose from "mongoose";
import Order from "../model/Order.mjs";
import Product from "../model/Product.mjs";
import Tracking from "../model/Tracking.mjs";
import { sendReceiptEmail } from "../util/sendReceiptEmail.mjs";

const formatProductList = (items) => {
  return items
    .map(
      item =>
        `<li>${item.title} (${item.variant.size}/${item.variant.color}) × ${item.quantity} - ₹${item.priceAtPurchase * item.quantity}</li>`
    )
    .join("");
};

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      coupon,
      totalAmount,
      paymentInfo
    } = req.body;

    const isPaid = paymentInfo.status === "paid";
    const now = new Date();

    // 1️⃣ Create order
    const newOrder = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      coupon,
      totalAmount,
      paymentInfo,
      isPaid,
      paidAt: isPaid ? now : null,
      deliveredAt: isPaid ? new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) : null
    });

    await newOrder.save();

    // 2️⃣ Reduce product stock
    for (const item of items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.variant.size,
          "variants.color": item.variant.color
        },
        {
          $inc: { "variants.$.stock": -item.quantity }
        }
      );
    }

    // 3️⃣ Create initial tracking
    await Tracking.addTrackingEvent(newOrder._id, req.user._id, {
      status: "ordered",
      message: "Your order has been placed successfully.",
      location: shippingAddress.city || "",
      trackingUrl: `http://localhost:5173/track/${newOrder._id}`
    });

    // 4️⃣ Send receipt email with tracking link
    if (isPaid) {
      const orderID = newOrder._id.toString().slice(-6).toUpperCase();

      await sendReceiptEmail({
        email: req.user.email,
        fullName: shippingAddress.fullName,
        orderID,
        dateTime: now.toLocaleString("en-IN"),
        productList: formatProductList(items),
        totalAmount: totalAmount.toFixed(2),
        trackingUrl: `http://localhost:5173/track/${newOrder._id}`
      });
    }

    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (err) {
    console.error("❌ Order placement error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getTrackingByOrderId = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const tracking = await Tracking.findOne({
      orderId,
      userId: req.user._id
    });
    console.log("Incoming orderId:", orderId);
    if (!tracking) {
      return res.status(404).json({ message: "Tracking not found" });
    }

    res.json(tracking);
  } catch (err) {
    console.error("Error fetching tracking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicTrackingByOrderId = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const tracking = await Tracking.findOne({ orderId }).lean();

    if (!tracking) {
      return res.status(404).json({ message: "Tracking not found" });
    }

    res.json(tracking);
  } catch (err) {
    console.error("Error fetching public tracking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
