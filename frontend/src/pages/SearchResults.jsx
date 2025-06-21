import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search fetch failed", err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="shop-page">
      <h2>Search Results for "{query}"</h2>
      <div className="product-grid">
        {results.length > 0 ? results.map(product => (
          <ProductCard key={product._id} product={product} />
        )) : <p>No products found.</p>}
      </div>
    </div>
  );
};

export default SearchResults;
