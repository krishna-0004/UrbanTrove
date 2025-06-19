import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  imageUrl: { type: String, required: true }, 
  link: { type: String }, 
  isActive: { type: Boolean, default: true }, 
  position: {
    type: String,
    enum: ['hero', 'category', 'promo', 'footer'],
    default: 'hero'
  },
  displayOrder: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Banner", bannerSchema);
