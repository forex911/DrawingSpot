import { useState } from "react";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import { FaCheckCircle } from "react-icons/fa";

const CONTACT_ITEMS = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        label: "Email Us",
        value: "sivasubramaniyan911@gmail.com",
        href: "mailto:sivasubramaniyan911@gmail.com",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        label: "WhatsApp",
        value: "+91 6381733236",
        href: "https://wa.me/6381733236",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        label: "Response Time",
        value: "Usually within a few hours",
        href: null,
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
        label: "Based in",
        value: "India · Ships Nationwide",
        href: null,
    },
];

function ContactUs() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError("");
        try {
            await API.post("/feedback", form);
            setSent(true);
        } catch (err) {
            console.error("Failed to send message:", err);
            setSubmitError("Failed to send your message. Please try again or reach us via WhatsApp.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-page">
            <Navbar />

            <div className="support-hero">
                <p className="section-tag">We'd Love to Hear From You</p>
                <h1>Contact Us</h1>
                <p>Have a question, a custom request, or just want to say hello? We're here.</p>
            </div>

            <div className="support-content">
                <div className="contact-layout">

                    {/* Left: info cards */}
                    <div className="contact-info">
                        {CONTACT_ITEMS.map((item) => (
                            <div className="contact-info-card" key={item.label}>
                                <div className="contact-info-icon">{item.icon}</div>
                                <div>
                                    <p className="contact-info-label">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="contact-info-value link">{item.value}</a>
                                    ) : (
                                        <p className="contact-info-value">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: form */}
                    <div className="contact-form-card">
                        {sent ? (
                            <div style={{ textAlign: "center", padding: "40px 20px" }}>
                                <FaCheckCircle style={{ fontSize: "3rem", marginBottom: 16, color: "var(--success, #2ecc71)" }} />
                                <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>Message Sent!</h3>
                                <p style={{ color: "var(--muted)" }}>We'll get back to you within a few hours.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="contact-form-title">Send a Message</h3>
                                <form onSubmit={handleSubmit} className="auth-form contact-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <input name="name" type="text" placeholder="Full name" value={form.name}
                                                onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input name="email" type="email" placeholder="you@example.com" value={form.email}
                                                onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input name="subject" type="text" placeholder="Order enquiry / Feedback / Other"
                                            value={form.subject} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea name="message" rows={5} placeholder="Tell us how we can help…"
                                            value={form.message} onChange={handleChange} required />
                                    </div>
                                    {submitError && (
                                        <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: 8 }}>{submitError}</p>
                                    )}
                                    <button type="submit" className="btn-primary"
                                        style={{ width: "100%", padding: "13px", borderRadius: 8 }} disabled={loading}>
                                        {loading ? "Sending…" : "Send Message →"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ContactUs;
