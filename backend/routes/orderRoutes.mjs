import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get("/", protect, getUserOrders);
router.post("/place", protect, placeOrder);

export default router;
