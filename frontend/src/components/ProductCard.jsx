import React, { useState } from 'react';
import './productCard.css';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const toggleWishlist = () => {
    setLiked(!liked);
  };

  return (
    <div className="product-card small">
      <div className="image-wrapper">
        <img src={product.images[0]} alt={product.title} />
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
        <h3 className="product-title">{product.title}</h3>

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
