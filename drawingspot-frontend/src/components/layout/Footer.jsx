import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaPinterest, FaWhatsapp, FaPalette, FaMapMarkerAlt } from "react-icons/fa";
import API from "../../api/axiosConfig";
import "../../App.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter an email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/newsletter/subscribe", { email });
      setMessage(response.data);
      setEmail("");
    } catch (error) {
      setMessage("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="logo"><FaPalette style={{ color: "var(--gold)", marginRight: "8px" }} />Drawing<span>Spot</span></div>
          <p>
            Handcrafted portraits that turn your
            most cherished memories into timeless works of art.
          </p>
          <div className="footer-socials">
            {[
              { icon: <FaInstagram />, link: "https://instagram.com/drawing.spot", label: "Instagram" },
              { icon: <FaPinterest />, link: "https://pinterest.com/SIVA_911", label: "Pinterest" },
              { icon: <FaWhatsapp />, link: "https://wa.me/6381733236", label: "Whatsapp" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/order">Place Order</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h5>Support</h5>
          <ul>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/art-buying-guide">Art Buying Guide</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h5>Stay Inspired</h5>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginBottom: "14px" }}>
            Get new artwork drops and exclusive deals.
          </p>
          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "..." : "→"}
            </button>
          </form>
          {message && (
            <p style={{
              fontSize: "0.8rem",
              marginTop: "8px",
              color: message.toLowerCase().includes("success") ? "#A4D0A4" : "#ff4d4f"
            }}>
              {message}
            </p>
          )}
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaMapMarkerAlt /> Delivered across India ·{" "}
            <a href="mailto:hello@drawingspot.in" style={{ color: "rgba(255,255,255,0.3)" }}>
              hello@drawingspot.in
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 DrawingSpot. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;