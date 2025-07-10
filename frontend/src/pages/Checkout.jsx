import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./checkout.css";

const Checkout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine: "",
    landmark: "",
    city: "",
    state: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          withCredentials: true,
        });
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const { fullName, phone, pincode, addressLine, city, state } = address;
    return fullName && phone && pincode && addressLine && city && state;
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }

    if (!validateAddress()) {
      toast.warning("Please fill in all required address fields.");
      return;
    }

    setPlacingOrder(true);

    if (paymentMethod === "cod") {
      await placeOrder("cod", { method: "cod", status: "pending" });
      setPlacingOrder(false);
    } else {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
          { amount: cart.totalAmount },
          { withCredentials: true }
        );

        const { id: razorpayOrderId, amount } = res.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount,
          currency: "INR",
          name: "UrbanTrove",
          description: "Complete your purchase",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              const verify = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/verify`,
                response,
                { withCredentials: true }
              );

              if (verify.data.success) {
                await placeOrder("razorpay", {
                  method: "razorpay",
                  razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  status: "paid"
                });
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (error) {
              console.error("Verification failed:", error);
              toast.error("Something went wrong while verifying payment.");
            } finally {
              setPlacingOrder(false);
            }
          },
          prefill: {
            name: address.fullName,
            email: user.email,
            contact: address.phone,
          },
          theme: { color: "#000" },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (err) {
        console.error("Payment error:", err);
        toast.error("Failed to initiate payment.");
        setPlacingOrder(false);
      }
    }
  };

  const placeOrder = async (method, paymentInfo) => {
    try {
      const formattedItems = cart.items.map(item => ({
        productId: item.product,
        title: item.title,
        sku: item.sku,
        variant: item.variant,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAddTime,
        image: item.image
      }));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/place`,
        {
          items: formattedItems,
          shippingAddress: address,
          totalAmount: cart.totalAmount,
          coupon: cart.coupon || {},
          paymentInfo
        },
        { withCredentials: true }
      );

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        withCredentials: true,
      });

      toast.success("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Order failed.");
    }
  };

  if (loading) return <Loader />;
  if (!cart) return null;

  return (
    <div className="checkout-container">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="checkout-left">
        <h2>Shipping Address</h2>
        <form className="address-form">
          {Object.keys(address).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={address[key]}
              onChange={handleInputChange}
              required
            />
          ))}
        </form>

        <h3>Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === "razorpay"}
            onChange={() => setPaymentMethod("razorpay")}
          />
          Pay with Razorpay
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Cash on Delivery
        </label>
      </div>

      <div className="checkout-right">
        <h3>Order Summary</h3>
        <div className="summary">
          {cart.items.map((item, i) => (
            <div key={i} className="summary-item">
              <p>{item.title} ({item.variant.size}/{item.variant.color}) × {item.quantity}</p>
              <p>₹{item.priceAtAddTime * item.quantity}</p>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ₹{cart.totalAmount.toFixed(2)}</strong>
          </div>
          <button
            className={`place-order-btn ${placingOrder ? "processing" : ""}`}
            onClick={handleCheckout}
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
