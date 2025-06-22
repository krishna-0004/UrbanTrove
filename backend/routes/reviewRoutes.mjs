import express from "express";
import {
  addOrUpdateReview,
  getProductReviews,
} from "../controllers/reviewController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/add", protect, addOrUpdateReview);
router.get("/product/:productId", getProductReviews);

export default router;
