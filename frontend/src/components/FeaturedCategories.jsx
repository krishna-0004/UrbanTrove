import { useNavigate } from "react-router-dom";
import "./featuredCategories.css";

import men from "../assets/categories/men.jpeg";
import women from "../assets/categories/women.jpeg";
import home from "../assets/categories/home.jpeg";
import accessories from "../assets/categories/accessories.jpeg";
import gifts from "../assets/categories/gifts.jpeg";

const categories = [
    { name: 'Mens Fashion', key: 'Mens Fashion', image: men },
    { name: 'Womens Fashion', key: 'Womens Fashion', image: women },
    { name: 'Footwear', key: 'Footwear', image: home },
    { name: 'Bags & Accessories', key: 'Bags & Accessories', image: accessories },
    { name: 'Ethnic Wear', key: 'Ethnic Wear', image: gifts },
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