import express from "express";
import { placeOrder } from "../controllers/orderController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/place", protect, placeOrder);

export default router;
