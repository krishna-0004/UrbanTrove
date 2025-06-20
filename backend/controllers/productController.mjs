import Product from "../model/Product.mjs";

export const getFeaturedCategories = async (req, res) => {
  try {
    const categories = ['men', 'women', 'home-decor', 'accessories', 'gifts'];
    const data = {};

    for (const category of categories) {
      const products = await Product.find({
        categories: { $in: [category] },
        isVisible: true
      }).limit(12);
      data[category] = products;
    }

    return res.json(data);
  } catch (error) {
    console.error("Error in getFeaturedCategories:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true })
      .sort({ 'ratings.count': -1 })
      .limit(9);

    return res.json(products);
  } catch (error) {
    console.error("Error in getBestSellers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true,
      isVisible: true
    })
      .sort({ createdAt: -1 })
      .limit(9);

    return res.json(products);
  } catch (error) {
    console.error("Error in getNewArrivals:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

