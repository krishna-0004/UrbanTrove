import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    size: { type: String },
    color: { type: String },
    stock: { type: Number, required: true, min: 0 },
}, { _id: false});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true},
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    categories: [{
        type: String,
        enum: ['men', 'women', 'home-decor', 'accessories', 'gifts'],
        required: true
    }],
    variants: [variantSchema],
    images: [{ type: String, required: true }],
    ratings: {
        average: { type: Number, default: 0},
        count: { type: Number, default: 0}
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    seller: {
        name: { type: String },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
    },
    shippingInfo: { type: String },
    returnPolicy: { type: String },
    isVisible: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);