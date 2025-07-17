import mongoose from "mongoose";
import slugify from "slugify";

const variantSchema = new mongoose.Schema({
    size: { type: String },
    color: { type: String },
    stock: { type: Number, required: true, min: 0 },
}, { _id: false});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true }, 
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true},
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    categories: [{
        type: String,
        enum: ['Mens Fashion', 'Womens Fashion', 'Footwear', 'Bags & Accessories', 'Ethnic Wear', 'Smartphones', 'Smartwatches & Wearables', 'Earphones & Headphones', 'Laptops & Tablets', 'Accessories', 'Home Gadgets'],
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

productSchema.pre('save', function (next) {
    if (!this.slug || this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model('Product', productSchema);