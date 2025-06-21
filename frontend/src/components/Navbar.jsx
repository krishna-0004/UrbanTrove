import React from 'react';
import { Link } from "react-router-dom";
import { HiShoppingCart } from "react-icons/hi";
import { IoHeart } from "react-icons/io5";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import SearchBar from './SearchBar';
import "./navbar.css";

const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <nav className="nav-menu">
      {/* Logo */}
      <Link to="/" className="logo-link">
        <img src="/logo-removebg-preview.png" alt="logo" />
        <img src="/name-removebg-preview.png" alt="company-name" />
      </Link>

      {/* Search Bar */}
      <div className="products-search">
        <SearchBar />
      </div>

      {/* Auth: Show user avatar + logout if logged in */}
      {user ? (
        <>
          <Link to="/dashboard" className="user-avatar">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="navbar-avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FaUserCircle size={30} />
            )}
          </Link>
        </>
      ) : (
        <Link to="/login">
          <FaUserCircle size={30} />
        </Link>
      )}

      {/* Wishlist & Cart */}
      <Link to="/whishlist">
        <IoHeart size={30} />
      </Link>
      <Link to="/cart">
        <HiShoppingCart size={30} />
      </Link>
    </nav>
  );
};

export default Navbar;
