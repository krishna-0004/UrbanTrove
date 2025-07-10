import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader"; // Ensure path is correct
import "./orderstable.css";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearch, status, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/order/?search=${debouncedSearch}&status=${status}&page=${page}&limit=10`,
        { withCredentials: true }
      );
      setOrders(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-container fade-in">
      <h2>Order Management</h2>

      <div className="order-controls">
        <input
          placeholder="Search by ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="order-table-wrapper">
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="no-data">No orders found</div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-6)}</td>
                  <td>{o.user?.name || "N/A"}</td>
                  <td>{o.orderStatus}</td>
                  <td>₹{o.totalAmount?.toFixed(2)}</td>
                  <td>{o.isPaid ? "Yes" : "No"}</td>
                  <td>
                    <Link to={`/admin/orders/${o._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTable;
