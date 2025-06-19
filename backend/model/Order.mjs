import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: { type: String, required: true },
    sku: { type: String, required: true },
    variant: {
        size: String,
        color: String,
    },
    quantity: { type: Number, required: true, min: 1},
    priceAtPurchase: { type: Number, required: true },
    image: { type: String, required: true },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
}, { _id: false });

const paymentInfoSchema = new mongoose.Schema({
    method: { type: String, enum: ['razorpay', 'cod'], required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { _id: false });

const orderSchema =  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    },
    shippingAddress: shippingAddressSchema,
    coupon: {
        code: { type: String },
        discountAmount: { type: Number, default: 0 }
    },
    totalAmount: { type: Number, required: true },
    paymentInfo: paymentInfoSchema,
    orderStatus: {
        type: String,
        enum: ['processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'processing'
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    trackingUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);