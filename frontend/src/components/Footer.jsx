import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>UrbanTrove</h2>
          <p>Discover stylish urban essentials crafted for your everyday lifestyle.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/contact">FAQs</a></li>
            <li><a href="/help">Help & Support</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Subscribe</h4>
          <p>Get updates on new arrivals and exclusive offers.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UrbanTrove. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
