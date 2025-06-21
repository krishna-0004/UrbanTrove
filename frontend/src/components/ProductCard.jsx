import React, { useState, useEffect } from 'react';
import './productCard.css';
import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import axios from 'axios';
import { AuthProvider, useAuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const slugId = `${slugify(product.title, { lower: true, strict: true })}-${product._id}`;

  useEffect(() => {
    if (user?.wishlist?.includes(product._id)) {
      setLiked(true)
    }
  }, [user, product._id])

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

      // Simply toggle `liked`
      setLiked(prev => !prev);

    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };


  return (
    <div className="product-card small">
      <div className="image-wrapper">
        <Link to={`/product/${slugId}`}>
          <img src={product.images[0]} alt={product.title} />
        </Link>

        <button
          className={`wishlist-btn ${liked ? 'liked' : ''}`}
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
        >
          <FaHeart />
        </button>

        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product/${slugId}`} className="product-link">
            {product.title}
          </Link>
        </h3>

        <div className="price">
          ₹{product.finalPrice.toFixed(2)}
          {product.discount > 0 && (
            <span className="original-price">₹{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="rating">
          ⭐ {product.ratings.average} ({product.ratings.count})
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
