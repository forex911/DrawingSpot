import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const SECTIONS = [
    {
        title: "Order Processing",
        items: [
            "Orders are confirmed within 24 hours of placement.",
            "You will receive a confirmation email with your order details.",
            "Our artists begin work within 1–2 business days of confirmation.",
            "A digital preview is shared before the physical portrait is framed.",
        ],
    },
    {
        title: "Delivery Timeline",
        items: [
            "Standard delivery: 5–15 business days after order confirmation.",
            "Large formats (A2): up to 20 business days.",
            "We do not ship on national holidays and Sundays.",
            "Expedited delivery is not available at this time.",
        ],
    },
    {
        title: "Shipping Coverage",
        items: [
            "We ship FREE across India to all pin codes via trusted couriers.",
            "Cash on Delivery (COD) is available on all domestic orders.",
            "International shipping is not yet available.",
            "We'll notify you when international orders open.",
        ],
    },
    {
        title: "Packaging",
        items: [
            "Every portrait is wrapped in acid-free tissue paper.",
            "Framed portraits are secured in a rigid cardboard box with foam corners.",
            "We add 'Fragile' labels and handle-with-care markings on all packages.",
            "Gift packaging with a personalised message card is available on request.",
        ],
    },
    {
        title: "Tracking",
        items: [
            "A tracking number will be shared via email/WhatsApp once dispatched.",
            "You can track your order on the courier's website.",
            "If tracking is not updated for 48 hours, contact us immediately.",
        ],
    },
    {
        title: "Damaged or Lost Parcels",
        items: [
            "If your portrait arrives damaged, photograph it and contact us within 48 hours.",
            "We will arrange a free replacement at no additional cost.",
            "For lost parcels, a replacement is dispatched after the courier investigation concludes (typically 7 days).",
        ],
    },
];

function ShippingPolicy() {
    return (
        <div className="support-page">
            <Navbar />

            <div className="support-hero">
                <p className="section-tag">Delivery Information</p>
                <h1>Shipping Policy</h1>
                <p>Free shipping across India. Every portrait packed with care and delivered to your door.</p>
            </div>

            <div className="support-content">
                {SECTIONS.map((sec) => (
                    <div className="shipping-section" key={sec.title}>
                        <h3 className="shipping-section-title">{sec.title}</h3>
                        <ul className="shipping-list">
                            {sec.items.map((item, i) => (
                                <li key={i}>
                                    <span className="shipping-dot" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="support-cta-box" style={{ marginTop: 48 }}>
                    <h2>Questions about your order?</h2>
                    <p>Reach out to us and we'll track it down for you.</p>
                    <a href="mailto:hello@drawingspot.in" className="btn-primary">Contact Support →</a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ShippingPolicy;
