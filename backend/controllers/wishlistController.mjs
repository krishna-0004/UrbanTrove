import User from "../model/User.mjs";
import Product from "../model/Product.mjs";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) return res.status(400).json({ message: "Product ID is required "});

        const user = await User.findById(userId);
        const index = user.wishlist.indexOf(productId);

        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        res.json({ message: "Wishlist updated", wishlist: user.wishlist });
    } catch (err) {
        console.error("Toggle wishlist error:", err);
        res.status(500).json({ message: "Internal server ereor "});
    }
};
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "wishlist",
            select: "title images finalPrice price descount ratings slug"
        });

        res.json(user.wishlist)
    } catch (err) {
        console.error("Get wishlist error:", err);
        res.status(500).json({ message: "Server error" });
    }
};