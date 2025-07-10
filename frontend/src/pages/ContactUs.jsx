import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactUs.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          toast.success('Message sent successfully!');
          form.current.reset();
        },
        (error) => {
          console.error('EmailJS Error:', error);
          toast.error('Failed to send message. Please try again.');
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="contact-container fade-in">
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <h2>Contact Us</h2>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <label>Name</label>
        <input type="text" name="user_name" required />

        <label>Email</label>
        <input type="email" name="user_email" required />

        <label>Subject</label>
        <input type="text" name="subject" required />

        <label>Message</label>
        <textarea name="message" rows="5" required />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
