import React from "react";
import "./helpSupport.css";

const HelpSupport = () => {
  return (
    <div className="help-page">
      <h1>Help & Support</h1>
      <p>Need assistance? We're here to help! Browse the FAQs below or reach out to our support team.</p>

      <h2>Frequently Asked Questions (FAQs)</h2>

      <div className="faq">
        <h3>🛒 How can I track my order?</h3>
        <p>Go to the <strong>Orders</strong> page in your dashboard and click on "Track Order" for real-time updates.</p>

        <h3>📦 Can I cancel or modify my order?</h3>
        <p>Orders can only be cancelled or modified within 1 hour of placing them. Contact our support team for urgent changes.</p>

        <h3>🔄 What is your return policy?</h3>
        <p>We accept returns within 7 days of delivery for eligible products. Check the product page or Return Policy for more.</p>

        <h3>💰 How are refunds processed?</h3>
        <p>Refunds are processed to the original payment method within 5–7 business days after we receive the returned item.</p>

        <h3>🔐 Is my payment information secure?</h3>
        <p>Absolutely. We use secure payment gateways like Razorpay and encrypt all sensitive data.</p>
      </div>

      <h2>Contact Support</h2>
      <p>If your question isn't answered above, feel free to contact us:</p>
      <ul className="contact-list">
        <li>Email: <a href="mailto:support@urbantrove.in">support@urbantrove.in</a></li>
        <li>Phone: <a href="tel:+919999999999">+91 99999 99999</a> (10 AM – 6 PM, Mon–Sat)</li>
        <li>Live Chat: Coming soon!</li>
      </ul>
    </div>
  );
};

export default HelpSupport;
