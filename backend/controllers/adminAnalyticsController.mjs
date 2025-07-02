import Order from "../model/Order.mjs";
import Product from "../model/Product.mjs";

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalProducts = await Product.countDocuments();
    const totalPendingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalPendingOrders,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSalesOverTime = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Sales over time error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          title: "$product.title",
          totalSold: 1,
          image: { $arrayElemAt: ["$product.images", 0] },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $unwind: "$product.categories" },
      {
        $group: {
          _id: "$product.categories",
          totalRevenue: { $sum: "$items.priceAtPurchase" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Category breakdown error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
