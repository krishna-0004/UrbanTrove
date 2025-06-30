import express from 'express';
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, toggleProductVisibility } from '../controllers/adminProductController.mjs';
import upload from '../middleware/multer.mjs';
import { protect } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post("/add", protect, isAdmin, upload.array("images", 5), createProduct);
router.put("/update/:id", protect, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/delete/:id", protect, isAdmin, deleteProduct);
router.get("/all",protect ,isAdmin, getAllProducts);
router.get("/:id", protect, isAdmin, getProductById);
router.patch("/:id/toggle-visibility", protect, isAdmin, toggleProductVisibility);


export default router;