import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import "./sharedProductGrid.css";

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchBestSellers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/best-sellers`);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch best sellers:', err);
        } finally {
            setLoading(false);
        };
      };

      fetchBestSellers();
    }, [])
    
  return (
    <div className="shop-page">
        <h2> Best Sellers </h2>
        {loading ? (
            <p>Loading best sellers...</p>
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

export default BestSellers;