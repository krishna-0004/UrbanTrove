import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/authMiddleware.mjs';
import { getCategoryBreakdown, getDashboardStats, getSalesOverTime, getTopSellingProducts } from '../controllers/adminAnalyticsController.mjs';

const router = express.Router();

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/sales-over-time", protect, isAdmin, getSalesOverTime);
router.get("/top-products", protect, isAdmin, getTopSellingProducts);
router.get("/category-breakdown", protect, isAdmin, getCategoryBreakdown);

export default router;