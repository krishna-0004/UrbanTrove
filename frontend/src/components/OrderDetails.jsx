import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./orderdetails.css";
import { toast } from "react-toastify";
import Loader from "./Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/order/${id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
      setTracking(res.data.tracking);
      setStatus(res.data.order.orderStatus);
      setTrackingUrl(res.data.tracking?.trackingUrl || "");
    } catch (err) {
      console.error("Order fetch error:", err);
      toast.error("Failed to fetch order");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/order/status/${id}`,
        {
          status,
          location,
          message,
          trackingUrl,
        },
        { withCredentials: true }
      );
      toast.success("Order status updated");
      fetchOrder();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return <Loader />;

  return (
    <div className="order-detail">
      <h2>Order #{order._id.slice(-6)}</h2>
      <p><strong>User:</strong> {order.user?.name}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      <p><strong>Status:</strong> {order.orderStatus}</p>
      <p><strong>Payment:</strong> {order.paymentInfo.status}</p>

      <h4>Update Status</h4>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {["processing", "packed", "shipped", "out-for-delivery", "delivered", "cancelled", "returned"].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        placeholder="Tracking URL (optional)"
        value={trackingUrl}
        onChange={(e) => setTrackingUrl(e.target.value)}
      />

      <button onClick={handleStatusUpdate} disabled={updating}>
        {updating ? "Updating..." : "Update Status"}
      </button>

      <h4>Items</h4>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.title} - {item.variant?.size}/{item.variant?.color} × {item.quantity}
          </li>
        ))}
      </ul>

      {tracking && (
        <>
          <h4>Tracking History</h4>
          <ul>
            {tracking.history.map((ev, i) => (
              <li key={i}>
                {ev.status} - {ev.message} @ {new Date(ev.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={() => navigate("/admin/orders")}>Back</button>
    </div>
  );
};

export default OrderDetails;
