import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Loader from "../components/Loader"; 
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/summary`, {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />; 

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <h1>Dashboard Overview</h1>
        <div className="admin-cards">
          <div className="admin-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="admin-card">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
          <div className="admin-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="admin-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-recent-orders">
          <h2>Recent Orders</h2>
          <div className="order-table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-orders">No recent orders found.</td>
                  </tr>
                ) : (
                  stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.user?.name || "Guest"}</td>
                      <td>{order.user?.email || "-"}</td>
                      <td>₹{order.totalAmount}</td>
                      <td className={`status ${order.isPaid ? "paid" : "unpaid"}`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
