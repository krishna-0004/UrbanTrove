import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './productDetails.css';
import { useAuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { slugId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/product/${slugId}`);
        const productData = res.data;
        setProduct(productData);
        setSelectedImg(productData.images[0]);
        setSelectedVariant(productData.variants[0]);

        const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${productData._id}`);
        setReviews(reviewRes.data);

        if (user) {
          const ownReview = reviewRes.data.find(r => r.user._id === user._id);
          setUserReview(ownReview || null);
        }

        const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/related/${productData._id}`);
        setRelatedProducts(relatedRes.data);
      } catch (err) {
        toast.error("Failed to load product.");
        console.error(err);
      }
    };

    fetchProductAndReviews();
  }, [slugId, user]);

  useEffect(() => {
    if (product && user?.wishlist?.includes(product._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, product]);

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
        { productId: product._id },
        { withCredentials: true }
      );
      setLiked(prev => !prev);
      toast.success(liked ? "Removed from wishlist." : "Added to wishlist!");
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Error updating wishlist.');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      toast.warn('Please select a variant (size/color).');
      return;
    }

    if (quantity < 1) {
      toast.warn('Please select a valid quantity.');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          productId: product._id,
          variant: {
            size: selectedVariant.size,
            color: selectedVariant.color,
          },
          quantity: parseInt(quantity),
        },
        { withCredentials: true }
      );

      toast.success('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add product to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newRating || !newComment.trim()) {
      toast.warn("Please fill in both rating and comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/add`, {
        productId: product._id,
        rating: newRating,
        comment: newComment
      }, { withCredentials: true });

      toast.success("Review submitted!");
      setNewRating(0);
      setNewComment('');
      const refreshed = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${product._id}`);
      setReviews(refreshed.data);
      const own = refreshed.data.find(r => r.user._id === user._id);
      setUserReview(own);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return <Loader />;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="product-details-container">
        {/* Image Section */}
        <div className="image-column">
          <div className="thumbnail-group">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`thumbnail ${selectedImg === img ? 'active' : ''}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
          <div className="main-image-wrapper">
            <img src={selectedImg} alt="Selected Product" className="main-image" />
            <button className={`wishlist-icon ${liked ? 'liked' : ''}`} onClick={toggleWishlist}>
              <FaHeart />
            </button>
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-column">
          <h1 className="product-title">{product.title}</h1>
          <div className="price-box">
            <span className="final-price">₹{product.finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="original-price">₹{product.price.toFixed(2)}</span>
                <span className="discount">({product.discount}% OFF)</span>
              </>
            )}
          </div>
          <div className="rating">
            ⭐ {product.ratings.average} ({product.ratings.count})
          </div>
          <p className="description">{product.description}</p>

          <div className="variant-section">
            <label>Choose Variant:</label>
            <div className="variant-options">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  className={`variant-chip ${selectedVariant?.size === v.size && selectedVariant?.color === v.color ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.size} / {v.color}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-row">
            <label>Qty:</label>
            <input
              type="number"
              min={1}
              max={selectedVariant?.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <span className="stock">({selectedVariant?.stock} left)</span>
          </div>

          <button
            className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? "Adding to Cart..." : "Add to Cart"}
          </button>

          <div className="meta-info">
            <p><strong>Shipping:</strong> {product.shippingInfo}</p>
            <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 && <p className="no-reviews-text">No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-avatar">{review.user.name.charAt(0).toUpperCase()}</div>
            <div className="review-content">
              <div className="review-header">
                <span className="review-name">{review.user.name}</span>
                <span className="review-stars">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          </div>
        ))}

        {!user ? (
          <p className="login-to-review">Login to leave a review.</p>
        ) : userReview ? (
          <p className="already-reviewed">You already reviewed this product.</p>
        ) : (
          <div className="review-form">
            <h3>Leave a Review</h3>
            <div className="form-review">
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                <option value={0}>Rating</option>
                {[1, 2, 3, 4, 5].map(r => (
                  <option key={r} value={r}>{r} ⭐</option>
                ))}
              </select>
              <textarea
                placeholder="Write your feedback here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="submit-review-btn"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
