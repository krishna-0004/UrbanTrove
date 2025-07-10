import React, { useEffect, useState } from 'react';
import './cart.css';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          withCredentials: true,
        });
        setCart(res.data);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast.error("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleQtyChange = async (productId, sku, newQty) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { productId, sku, quantity: newQty },
        { withCredentials: true }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to update item:", err);
      toast.error("Failed to update quantity.");
    }
  };

  const removeItem = async (productId, sku) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove`,
        {
          data: { productId, sku },
          withCredentials: true,
        }
      );
      setCart(res.data.cart);
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item.");
    }
  };

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 4);
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });
  };

  if (loading) return <Loader />;

  if (!cart || cart.items.length === 0)
    return (
      <div className="empty-cart-message">
        <h2>Your cart is empty 😢</h2>
        <p>Looks like you haven’t added anything yet. Let’s get you started!</p>
        <button onClick={() => navigate('/')}>Go Shopping</button>
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </div>
    );

  return (
    <div className="cart-container">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="cart-left">
        {cart.items.map((item, index) => (
          <div className="cart-card fade-in" key={index}>
            <div className="card-img">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="card-content">
              <div className="card-top">
                <h3 className="product-title">{item.title}</h3>
                <p className="variant">Size: {item.variant.size} | Color: {item.variant.color}</p>
                <p className="delivery">Delivery by <strong>{getDeliveryDate()}</strong></p>
              </div>

              <div className="card-bottom">
                <div className="price">
                  ₹{item.priceAtAddTime} × {item.quantity} = <strong>₹{item.priceAtAddTime * item.quantity}</strong>
                </div>

                <div className="actions">
                  <label>
                    Qty:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyChange(item.product, item.sku, parseInt(e.target.value))
                      }
                    />
                  </label>
                  <button className="remove-btn" onClick={() => removeItem(item.product, item.sku)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-right">
        <div className="summary-box">
          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{cart.items.length}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cart.totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span><b>₹{cart.totalAmount.toFixed(2)}</b></span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
