import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import { useMediaQuery } from "react-responsive";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { user, logout } = useAuthContext();

  // Show sidebar only if screen width is 1024px or more
  const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

  if (!isLaptop) {
    return (
      <div className="admin-mobile-warning">
        <p>This admin panel is accessible only on a laptop or larger screen.</p>
      </div>
    );
  }

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-sidebar-title">
          <h2>UrbanTrove Admin</h2>
        </div>

        <div className="admin-sidebar-user">
          <img src={user?.avatar} alt={user.name} className="admin-avatar" />
          <h2>{user.name}</h2>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end>
            <FaTachometerAlt />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products">
            <FaBoxOpen />
            Products
          </NavLink>
          <NavLink to="/admin/orders">
            <FaClipboardList />
            Orders
          </NavLink>
          <NavLink to="/admin/analytics">
            <FaChartBar />
            Analytics
          </NavLink>
        </nav>
      </div>

      <div className="admin-sidebar-bottom">
        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
