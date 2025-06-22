import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
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
  
  // ✅ Fetch product and reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/product/${slugId}`);
        const productData = res.data;
        setProduct(productData);
        setSelectedImg(productData.images[0]);
        setSelectedVariant(productData.variants[0]);

        // Fetch reviews
        const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${productData._id}`);
        setReviews(reviewRes.data);

        if (user) {
          const ownReview = reviewRes.data.find(r => r.user._id === user._id);
          setUserReview(ownReview || null);
        }

        // Fetch related products
        const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/related/${productData._id}`);
        setRelatedProducts(relatedRes.data);
      } catch (err) {
        console.error("Error loading product or related/reviews:", err);
      }
    };

    fetchProductAndReviews();
  }, [slugId, user]);

  // ✅ Set wishlist state
  useEffect(() => {
    if (product && user?.wishlist?.includes(product._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, product]);

  // ✅ Toggle wishlist
  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
        { productId: product._id },
        { withCredentials: true }
      );
      setLiked(prev => !prev);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  // ✅ Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (product?._id) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/related/${product._id}`);
          setRelatedProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelated();
  }, [product]);

  // ✅ Handle Add to Cart
  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      alert('Please select a variant (size/color)');
      return;
    }

    if (quantity < 1) {
      alert('Please select a valid quantity');
      return;
    }

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

      alert('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add product to cart.');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/add`, {
        productId: product._id,
        rating: newRating,
        comment: newComment
      }, { withCredentials: true });

      alert("Review submitted!");
      setNewRating(0);
      setNewComment('');
      const refreshed = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${product._id}`);
      setReviews(refreshed.data);
      const own = refreshed.data.find(r => r.user._id === user._id);
      setUserReview(own);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review.");
    }
  };


  if (!product) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <div className="product-details-container">
        {/* Images */}
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

        {/* Info */}
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

          {/* Variants */}
          <div className="variant-section">
            <label>Choose Variant:</label>
            <div className="variant-options">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  className={`variant-chip ${selectedVariant?.size === v.size && selectedVariant?.color === v.color ? 'active' : ''
                    }`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.size} / {v.color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
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

          {/* Add to Cart Button */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {/* Shipping Info */}
          <div className="meta-info">
            <p><strong>Shipping:</strong> {product.shippingInfo}</p>
            <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <strong>{review.user.name}</strong>
              <span>⭐ {review.rating}</span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}

        {!user ? (
          <p className="login-to-review">Login to leave a review.</p>
        ) : userReview ? (
          <p className="already-reviewed">You already reviewed this product.</p>
        ) : (
          <div className="review-form">
            <h3>Leave a Review</h3>
            <label>
              Rating:
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                <option value={0}>Select</option>
                {[1, 2, 3, 4, 5].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </label>
            <textarea
              placeholder="Write your feedback here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="submit-review-btn" onClick={handleSubmitReview}>
              Submit Review
            </button>
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
