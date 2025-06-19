import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },    
    maxDiscountAmount: { type: Number },              
    expiresAt: { type: Date },                       
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number },                     
    usedCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Coupon", couponSchema);