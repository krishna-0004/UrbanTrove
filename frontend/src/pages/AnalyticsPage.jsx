import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AnalyticsPage.css";

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      const [dashboardRes, salesRes, topRes, categoryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/dashboard`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/sales-over-time`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/top-products`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/category-breakdown`, { withCredentials: true }),
      ]);
      setDashboard(dashboardRes.data);
      setSalesData(salesRes.data);
      setTopProducts(topRes.data);
      setCategoryBreakdown(categoryRes.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    }
  };

  return (
    <div className="analytics-container">
      <h2>Admin Analytics</h2>

      {dashboard && (
        <div className="dashboard-cards">
          <div className="card">Total Orders: {dashboard.totalOrders}</div>
          <div className="card">Total Revenue: ₹{dashboard.totalRevenue.toLocaleString()}</div>
          <div className="card">Total Products: {dashboard.totalProducts}</div>
          <div className="card">Pending Orders: {dashboard.totalPendingOrders}</div>
        </div>
      )}

      <h3>Sales Over Last 6 Months</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Sales (₹)</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((s) => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.totalSales.toFixed(2)}</td>
              <td>{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Top Selling Products</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.image} alt={p.title} height="50" />
              </td>
              <td>{p.title}</td>
              <td>{p.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Revenue by Category</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>
        <tbody>
          {categoryBreakdown.map((c) => (
            <tr key={c._id}>
              <td>{c._id}</td>
              <td>{c.totalRevenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsPage;
