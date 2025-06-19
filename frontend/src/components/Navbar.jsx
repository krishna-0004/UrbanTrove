import React from 'react'
import { Link } from "react-router-dom";
import { HiShoppingCart } from "react-icons/hi";
import { IoHeart } from "react-icons/io5";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import "./navbar.css"

const Navbar = () => {
  return (
    <nav className='nav-menu'>
        <Link to="/"><img src="logo-removebg-preview.png" alt="logo-removedbg" /><img src="/name-removebg-preview.png" alt="name-company" /></Link>
        <div className="products-search">
          <input type="search" name="search-products" id="search" placeholder='Search for Products'/>
          <FaSearch />
        </div>
        <Link to="/login"><FaUserCircle size={30} /></Link>
        <Link to="/whishlist"><IoHeart size={30} /></Link>
        <Link to="/cart"><HiShoppingCart size={30} /></Link>
    </nav>
  )
}

export default Navbar;