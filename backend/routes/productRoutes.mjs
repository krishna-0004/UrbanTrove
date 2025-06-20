import express from "express";
import { getFeaturedCategories, getBestSellers, getNewArrivals } from "../controllers/productController.mjs";

const router = express.Router();

router.get('/featured-categories', getFeaturedCategories);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

export default router;