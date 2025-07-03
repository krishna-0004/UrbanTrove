import express from "express";
import { placeOrder, getUserOrders, getPublicTrackingByOrderId } from "../controllers/orderController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get("/", protect, getUserOrders);
router.post("/place", protect, placeOrder);
router.get("/public-track/:orderId", protect, getPublicTrackingByOrderId);

export default router;
