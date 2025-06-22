import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

export default router;
