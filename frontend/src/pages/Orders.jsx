import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./orders.css";

const Orders = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!orders.length) return <p className="loading-text">No orders found.</p>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.isPaid ? "Paid" : "Pending"}</p>
            <p><strong>Payment:</strong> {order.paymentInfo?.method}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="order-items">
            {order.items.map((item, idx) => (
              <div className="order-item" key={idx}>
                <img src={item.image} alt={item.title} />
                <div>
                  <p>{item.title}</p>
                  <p>{item.variant.size} / {item.variant.color}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.priceAtPurchase * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
