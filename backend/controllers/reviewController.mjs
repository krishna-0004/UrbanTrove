import Review from "../model/Review.mjs";
import Product from "../model/Product.mjs";

// ⭐ Helper: Recalculate rating stats
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const total = reviews.length;

  if (total === 0) {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': 0,
      'ratings.count': 0
    });
    return;
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  await Product.findByIdAndUpdate(productId, {
    'ratings.average': average.toFixed(1),
    'ratings.count': total
  });
};

// ✅ Add or Update Review
export const addOrUpdateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let review = await Review.findOne({ product: productId, user: userId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = new Review({
        product: productId,
        user: userId,
        rating,
        comment
      });
      await review.save();
    }

    await updateProductRatings(productId);

    res.status(200).json({ message: "Review saved", review });
  } catch (err) {
    console.error("Add/Update Review Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📥 Get All Reviews for a Product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar") // get name and avatar from user
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Fetch Reviews Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};