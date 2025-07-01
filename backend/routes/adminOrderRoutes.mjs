import express from 'express';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/adminOrderController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get("/", protect, isAdmin, getAllOrders);
router.get("/:id", protect, isAdmin, getOrderById);
router.put("/status/:id", protect, isAdmin, updateOrderStatus);

export default router;