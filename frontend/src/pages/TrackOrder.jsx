import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./trackOrder.css";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/public-track/${orderId}`, {withCredentials: true});
        setTracking(res.data);
      } catch (err) {
        setError("Tracking info not found or invalid order ID.");
        console.error(err);
      }
    };

    fetchTracking();
  }, [orderId]);

  if (error) return <p className="tracking-error">{error}</p>;
  if (!tracking) return <p className="tracking-loading">Loading tracking info...</p>;

  return (
    <div className="tracking-container">
      <h2>Order Tracking</h2>
      <p><strong>Current Status:</strong> {tracking.currentStatus}</p>
      <ul>
        {tracking.history.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.status}</strong> — {entry.message || "No message"} <br />
            <small>{new Date(entry.timestamp).toLocaleString()}</small>
            {entry.location && <> (📍 {entry.location})</>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackOrder;
