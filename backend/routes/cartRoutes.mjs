import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.mjs';

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeFromCart);

export default router;
