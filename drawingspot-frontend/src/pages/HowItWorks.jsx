import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

const STEPS = [
    {
        number: "01",
        title: "Upload Your Reference Photo",
        desc: "Send us a clear, well-lit photo of the person you'd like portrayed. We accept JPG, PNG, or WEBP — any resolution works, but higher quality gives richer detail.",
    },
    {
        number: "02",
        title: "Choose Style & Size",
        desc: "Pick Black & White (pencil/graphite) or full Colour portrait, then choose your canvas size from A5 to A2. Not sure? Check our Pricing page for a size guide.",
    },
    {
        number: "03",
        title: "Place Your Order",
        desc: "Complete the order form with your details and reference photo. We accept online payment as well as Cash on Delivery across India.",
    },
    {
        number: "04",
        title: "Artist Creates Your Portrait",
        desc: "One of our professional artists hand-draws your portrait with care and precision. We send you a digital preview of the work before finalising — and revisions are free.",
    },
    {
        number: "05",
        title: "Review & Approve",
        desc: "We share a high-res preview via WhatsApp or Email. Tell us if you'd like any changes. We refine until you love it — no questions asked.",
    },
    {
        number: "06",
        title: "Framed & Delivered",
        desc: "Your portrait is framed in a premium frame, carefully packed, and shipped free to your doorstep anywhere in India. Most orders arrive within 5–15 business days.",
    },
];

function HowItWorks() {
    return (
        <div className="support-page">
            <Navbar />

            <div className="support-hero">
                <p className="section-tag">Simple Process</p>
                <h1>How It Works</h1>
                <p>From your photo to a framed masterpiece on your wall — in 6 easy steps.</p>
            </div>

            <div className="support-content">
                <div className="hiw-grid">
                    {STEPS.map((s) => (
                        <div className="hiw-card" key={s.number}>
                            <div className="hiw-number">{s.number}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="support-cta-box">
                    <h2>Ready to get started?</h2>
                    <p>Place your order today and receive a digital preview within 3–5 business days.</p>
                    <Link to="/order" className="btn-primary">Place an Order →</Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default HowItWorks;
