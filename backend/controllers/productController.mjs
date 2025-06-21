import slugify from "slugify";
import Product from "../model/Product.mjs";
import Review from "../model/Review.mjs";

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

export const getProductBySlugId = async (req, res) => {
  const { slugId } = req.params;

  try {
    const id = slugId.split("-").slice(-1)[0];

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("reviews");

    if (!product || !product.isVisible) {
      return res.status(404).json({ message: "Product not found" });
    }

    const expectedSlug = slugify(product.title, { lower: true, strict: true });
    if (!slugId.startsWith(expectedSlug)) {
      return res.redirect(`/product/${expectedSlug}-${product._id}`);
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRelatedProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const currentProduct = await Product.findById(id);
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      _id: { $ne: id },
      categories: { $in: currentProduct.categories },
      isVisible: true
    }).limit(9);

    res.json(related);
  }catch (err) {
    console.error("Error fetching related products:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    const textResults = await Product.find(
      { $text: { $search: query }, isVisible: true },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .select("title images finalPrice discount price ratings slug");

    if (textResults.length > 0) return res.json(textResults);

    const regex = new RegExp(query, "i");
    const fuzzyResults = await Product.find({
      isVisible: true,
      $or: [
        { title: regex },
        { description: regex },
        { categories: regex }
      ]
    }).limit(10)
      .select("title images finalPrice discount price ratings slug");

    res.json(fuzzyResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  } 
};

export const getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(`^${query}`, "i");
    const suggestions = await Product.find({
      title: regex,
      isVisible: true
    })
      .limit(7)
      .select("title slug");

    res.json(suggestions);
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
