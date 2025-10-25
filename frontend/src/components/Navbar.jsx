import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiShoppingCart } from "react-icons/hi";
import { IoHeart } from "react-icons/io5";
import { FaUserCircle, FaBox, FaHome } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import "./navbar.css";

const Navbar = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="nav-menu">
        <div className="nav-content">
          {/* Left - Logo */}
          <Link to="/" className="logo-link">
            <img src="/logo-removebg-preview.png" alt="logo" className="logo-img" />
            <img src="/name-removebg-preview.png" alt="company-name" className="company-name-img" />
          </Link>

          {/* Center - Search */}
          <SearchBar />

          {/* Right - Profile */}
          <div className="profile-section">
            {user ? (
              <Link to="/dashboard" className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="navbar-avatar" />
                ) : (
                  <FaUserCircle size={30} />
                )}
              </Link>
            ) : (
              <Link to="/login">
                <FaUserCircle size={30} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* BOTTOM MOBILE NAV */}
      <div className="bottom-nav">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <FaHome size={22} />
          <span>Home</span>
        </Link>
        <Link to="/wishlist" className={location.pathname === "/wishlist" ? "active" : ""}>
          <IoHeart size={22} />
          <span>Wishlist</span>
        </Link>
        <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
          <HiShoppingCart size={22} />
          <span>Cart</span>
        </Link>
        <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>
          <FaBox size={22} />
          <span>Orders</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
