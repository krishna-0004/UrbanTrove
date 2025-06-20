import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Product from "../model/Product.mjs";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find();

for (const product of products) {
  product.slug = slugify(product.title, { lower: true, strict: true });
  await product.save();
}

console.log("Slugs added to existing products");
process.exit(0);
