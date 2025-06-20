import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import "./sharedProductGrid.css";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchNewArrivals = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/new-arrivals`);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch new arrivals:', err);
        } finally {
            setLoading(false);
        }
      };

      fetchNewArrivals();
    }, [])
    
  return (
    <div className="shop-page">
      <h2> New Arrivals</h2>
      {loading ? (
        <p>Loading new arrivals...</p>
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

export default NewArrivals;