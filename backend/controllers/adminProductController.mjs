import Product from "../model/Product.mjs";
import { uploadToCloudinary } from "../config/cloudinary.mjs";
import slugify from "slugify";
import fs from "fs/promises";
import fsSync from "fs"; 

const parseJSON = (value, fallback = []) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value || fallback;
  } catch {
    return fallback;
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      sku,
      discount,
      isNewArrival,
      isFeatured,
      shippingInfo,
      returnPolicy,
      metaTitle,
      metaDescription,
    } = req.body;

    const categories = parseJSON(req.body.categories);
    const variants = parseJSON(req.body.variants);
    const files = req.files || [];

    if (!title || !description || !price || !sku || !categories.length || !variants.length) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (files.length < 2) {
      return res.status(400).json({ message: "At least 2 images are required." });
    }

    const uploadPromises = files.map(async (file) => {
      const result = await uploadToCloudinary(file.path);
      if (fsSync.existsSync(file.path)) {
        await fs.unlink(file.path);
      }
      return result.secure_url;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const numericPrice = Number(price);
    const numericDiscount = Number(discount || 0);
    const finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;

    const product = await Product.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      description,
      sku,
      price: numericPrice,
      discount: numericDiscount,
      finalPrice,
      categories,
      variants,
      images: uploadedImages,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      shippingInfo,
      returnPolicy,
      metaTitle,
      metaDescription,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    const files = req.files || [];

    updates.categories = parseJSON(req.body.categories);
    updates.variants = parseJSON(req.body.variants);

    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.discount !== undefined) updates.discount = Number(req.body.discount);

    if (updates.price !== undefined && updates.discount !== undefined) {
      updates.finalPrice = updates.price - (updates.price * updates.discount) / 100;
    }

    if (req.body.title) {
      updates.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    if (req.body.isNewArrival !== undefined) {
      updates.isNewArrival = req.body.isNewArrival === "true" || req.body.isNewArrival === true;
    }
    if (req.body.isFeatured !== undefined) {
      updates.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
    }

    if (files.length) {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadToCloudinary(file.path);
        if (fsSync.existsSync(file.path)) {
          await fs.unlink(file.path);
        }
        return result.secure_url;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      updates.images = uploadedImages;
    }

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Get all products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isVisible = !product.isVisible;
    await product.save();

    res.json({ message: `Product visibility set to ${product.isVisible}` });
  } catch (err) {
    console.error("Toggle visibility error:", err);
    res.status(500).json({ message: "Toggle failed" });
  }
};
