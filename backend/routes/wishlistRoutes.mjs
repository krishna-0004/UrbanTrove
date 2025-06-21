import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/toggle", protect, toggleWishlist);
router.get("/", protect, getWishlist);

export default router;