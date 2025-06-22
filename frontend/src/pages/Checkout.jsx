import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    return address.fullName && address.phone && address.pincode &&
      address.addressLine && address.city && address.state;
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return alert("Your cart is empty.");
    if (!validateAddress()) return alert("Please fill in all required address fields.");

    if (paymentMethod === "cod") {
      placeOrder("cod", { method: "cod", status: "pending" });
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
                { withCredentials: true }  // ✅ THIS LINE FIXES THE 401 ERROR
              );

              if (verify.data.success) {
                placeOrder("razorpay", {
                  method: "razorpay",
                  razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  status: "paid"
                });
              } else {
                alert("Payment verification failed.");
              }
            } catch (error) {
              console.error("Verification failed:", error);
              alert("Something went wrong while verifying payment.");
            }
          },
          prefill: {
            name: address.fullName,
            email: user.email,
            contact: address.phone,
          },
          theme: {
            color: "#000",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (err) {
        console.error("Payment error:", err);
        alert("Failed to initiate payment.");
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

    const res = await axios.post(
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

    // ✅ Clear cart
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
      withCredentials: true,
    });

    alert("Order placed successfully!");
    navigate("/orders");

  } catch (err) {
    console.error("Order error:", err);
    alert("Order failed.");
  }
};


  if (!cart) return <p className="loading-text">Loading checkout...</p>;

  return (
    <div className="checkout-container">
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
          <button className="place-order-btn" onClick={handleCheckout}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
