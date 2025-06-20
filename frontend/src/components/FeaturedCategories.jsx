import React from "react";
import { useNavigate } from "react-router-dom";
import "./featuredCategories.css";

import men from "../assets/categories/men.jpeg";
import women from "../assets/categories/women.jpeg";
import home from "../assets/categories/home.jpeg";
import accessories from "../assets/categories/accessories.jpeg";
import gifts from "../assets/categories/gifts.jpeg";

const categories = [
    { name: 'Men', key: 'men', image: men },
    { name: 'Women', key: 'women', image: women },
    { name: 'Home', key: 'home-decor', image: home },
    { name: 'Accessories', key: 'accessories', image: accessories },
    { name: 'Gifts', key: 'gifts', image: gifts },
];

const FeaturedCategories = () => {
    const navigate = useNavigate();

    const handleClick = (category) => {
        navigate(`/shop/${category}`);
    };

    return (
        <div className="featured-categories">
            {categories.map((cat) => (
                <div
                    className="category-card"
                    key={cat.key}
                    onClick={() => handleClick(cat.key)}
                >
                    <img src={cat.image} alt={cat.name} />
                    <h3>{cat.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default FeaturedCategories;