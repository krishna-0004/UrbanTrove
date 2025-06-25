import express from "express";
import { getAdminSummary } from "../controllers/adminController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import { isAdmin } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get("/summary", protect, isAdmin, getAdminSummary);

export default router;