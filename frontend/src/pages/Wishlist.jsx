import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import "./wishlist.css";


const Wishlist = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuthContext();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist/`, {
                    withCredentials: true,
                });
                setWishlist(res.data);
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        };

        if (user) {
            fetchWishlist();
        } else {
            navigate('/login')
        }
    }, [user])

    if (loading) return <p>Loading...</p>;

    return (
        <div className="wishlist-page">
            <h2> My Wishlist</h2>
            {wishlist.length === 0 ? (
                <p>Your Wishlist is empty.</p>
            ) : (
            <div className="wishlist-grid">
                {wishlist.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        )}
        </div>
    );
};

export default Wishlist;