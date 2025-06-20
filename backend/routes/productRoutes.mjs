import express from "express";
import { getFeaturedCategories, getBestSellers, getNewArrivals, getProductBySlugId, getRelatedProducts } from "../controllers/productController.mjs";

const router = express.Router();

router.get('/featured-categories', getFeaturedCategories);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get("/product/:slugId", getProductBySlugId);
router.get('/related/:id', getRelatedProducts);

export default router;