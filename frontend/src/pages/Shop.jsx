import React from 'react'
import { useEffect, useState } from 'react';
import axios from "axios";
import ProductCard from '../components/ProductCard';
import { useParams } from 'react-router-dom';
import "./shop.css";

const Shop = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedCategory = category.toLowerCase();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/featured-categories`);
        const categoryProducts = res.data[formattedCategory] || [];
        setProducts(categoryProducts);
      } catch (err) {
        console.error('Failed to fetch category products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [formattedCategory]);

  return (
    <div className="shop-page">
      <h2>{formattedCategory.replace('-', ' ').toUpperCase()}</h2>

      {loading ? (
        <p>Loading Products...</p>
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;