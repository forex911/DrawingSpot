import { useState } from "react";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const FAQS = [
    {
        q: "How long does a portrait take?",
        a: "Most portraits are completed and shipped within 5–15 business days. Complex or large (A2) pieces may take up to 20 days. We'll keep you updated throughout the process.",
    },
    {
        q: "What type of photo should I send?",
        a: "A clear, well-lit, front-facing photo gives the best result. Avoid blurry, dark, or heavily filtered images. We recommend natural light and a plain background. Multiple photos from different angles are always welcome.",
    },
    {
        q: "Can I request changes after seeing the preview?",
        a: "Absolutely! Free revisions are included with every order. Once we share the digital preview, you can request adjustments to details, shading, or proportions — we refine until you're 100% happy.",
    },
    {
        q: "Do you offer Cash on Delivery?",
        a: "Yes. COD is available across India. You can also pay online via UPI, Debit/Credit Card, or Net Banking during checkout.",
    },
    {
        q: "What sizes are available?",
        a: "We offer A5 (5×7 in), A4 (8×11 in), A3 (11×16 in), and A2 (16×23 in) canvas sizes. Prices vary by size — check our Pricing page for a full breakdown.",
    },
    {
        q: "Is the portrait framed?",
        a: "Yes! Every portrait is delivered in a premium quality frame, ready to hang. The frame is included in the price at no extra cost.",
    },
    {
        q: "Can I order a portrait of a pet?",
        a: "Currently we specialise in human portraits — solo, couple, and family. Pet portraits may be available on request; contact us to check availability.",
    },
    {
        q: "Do you ship outside India?",
        a: "At the moment we ship within India only. International shipping is coming soon. Sign up for our newsletter to be notified.",
    },
    {
        q: "What if my portrait arrives damaged?",
        a: "We pack every order with great care, but if it arrives damaged, contact us immediately with photos. We'll replace it at no cost.",
    },
    {
        q: "Can I order as a gift?",
        a: "Absolutely — most of our orders are gifts! We offer discreet packaging and can include a personalised gift message. Just mention it in the order notes.",
    },
];

function FAQItem({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? " open" : ""}`}>
            <button className="faq-question" onClick={() => setOpen((o) => !o)}>
                <span>{item.q}</span>
                <span className="faq-chevron">{open ? "−" : "+"}</span>
            </button>
            {open && <p className="faq-answer">{item.a}</p>}
        </div>
    );
}

function FAQs() {
    return (
        <div className="support-page">
            <Navbar />

            <div className="support-hero">
                <p className="section-tag">Got Questions?</p>
                <h1>Frequently Asked Questions</h1>
                <p>Everything you need to know about ordering a custom portrait from DrawingSpot.</p>
            </div>

            <div className="support-content">
                <div className="faq-list">
                    {FAQS.map((f) => <FAQItem key={f.q} item={f} />)}
                </div>

                <div className="support-cta-box" style={{ marginTop: 60 }}>
                    <h2>Still have questions?</h2>
                    <p>Drop us a message and we'll get back to you within a few hours.</p>
                    <a href="mailto:hello@drawingspot.in" className="btn-primary">Email Us →</a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default FAQs;
