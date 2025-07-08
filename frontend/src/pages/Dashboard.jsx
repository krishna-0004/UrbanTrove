import React from "react";
import { useAuthContext } from "../context/AuthContext";
import "./dashboard.css"; // Create this file for styles
import { Link } from "react-router-dom";
import { FaHeart, FaBox, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const { user, loading, logout } = useAuthContext();

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not logged in</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-profile-card">
        <img
          src={user.avatar}
          alt={user.name}
          className="dashboard-avatar"
        />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="dashboard-role">{user.role}</span>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/orders" className="dashboard-action">
          <FaBox size={24} />
          <span>My Orders</span>
        </Link>
        <Link to="/wishlist" className="dashboard-action">
          <FaHeart size={24} />
          <span>My Wishlist</span>
        </Link>
        <Link to="/addresses" className="dashboard-action">
          <FaMapMarkedAlt size={24} />
          <span>Saved Addresses</span>
        </Link>
        <button onClick={logout} className="dashboard-action logout-btn">
          <FaSignOutAlt size={24} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
