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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
        { productId: product?._id },
        { withCredentials: true }
      );

      // Simply toggle `liked`
      setLiked(prev => !prev);

    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };



  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/product/${slugId}`);
        setProduct(res.data);
        setSelectedImg(res.data.images[0]);
        setSelectedVariant(res.data.variants[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [slugId]);

  // Fetch related products after product is fetched
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

          {/* Cart Button */}
          <button className="add-to-cart-btn">Add to Cart</button>

          {/* Shipping Info */}
          <div className="meta-info">
            <p><strong>Shipping:</strong> {product.shippingInfo}</p>
            <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
          </div>
        </div>
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
