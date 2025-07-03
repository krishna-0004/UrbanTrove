import React from 'react';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import "./ContactUs.css";

const ContactUs = () => {
    const form = useRef();
    const [status, setStatus] = useState(null);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setStatus("Message sent successfully!");
                    form.current.reset();
                },
                (error) => {
                    setStatus("Failed to send message. Please try again.");
                    console.error("EmailJS Error:", error);
                }
            );
    };
    return (
        <div className="contact-container">
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

                <button type="submit">Send</button>

                {status && <p className="status-msg">{status}</p>}
            </form>
        </div>
    )
}

export default ContactUs