import User from "../model/User.mjs";
import Order from "../model/Order.mjs";
import Product from "../model/Product.mjs";

export const getAdminSummary = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } } 
        ]);

        const totalProducts = await Product.countDocuments();
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email");

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts,
            recentOrders
        });
    } catch (err) {
        console.error("Error fetching admin summary:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
};