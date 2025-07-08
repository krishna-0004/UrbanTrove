import Cart from "../model/Cart.mjs";
import Product from "../model/Product.mjs";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variant, quantity } = req.body;

    if (!productId || !variant || !quantity)
      return res.status(400).json({ message: "All fields required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sku = `${variant.size}-${variant.color}`;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.sku === sku
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        title: product.title,
        sku,
        variant,
        quantity,
        priceAtAddTime: product.finalPrice,
        image: product.images[0],
      });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.priceAtAddTime * item.quantity,
      0
    );
    cart.updatedAt = Date.now();

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId && i.sku === sku
    );
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.priceAtAddTime * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, sku } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.sku === sku)
    );

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.priceAtAddTime * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [], coupon: null });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
