import { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { FaHeart, FaPalette, FaCamera, FaSync, FaEye, FaTruck, FaCreditCard, FaClock, FaHourglassHalf } from "react-icons/fa";

// Default dimensions mapping for standard sizes
const DIMENSIONS = {
  "A5": "5 × 8 in",
  "A4": "8 × 12 in",
  "A3": "12 × 17 in",
  "A2": "16 × 23 in",
  "A1": "23 × 33 in"
};

// Helper function to group the flat array from DB into matched size cards
const groupPricingData = (flatData) => {
  const grouped = {};

  // Sort sizes logically (A5 -> A1)
  const sizeOrder = ["A5", "A4", "A3", "A2", "A1"];

  flatData.forEach(item => {
    if (!grouped[item.size]) {
      grouped[item.size] = {
        size: item.size,
        dimension: DIMENSIONS[item.size] || "",
        rows: []
      };
    }

    // Sort rows (Single -> Couple -> Family)
    const getSortOrder = (type) => {
      if (type.includes("Single")) return 1;
      if (type.includes("Couple")) return 2;
      return 3;
    };

    // Construct the row object
    grouped[item.size].rows.push({
      label: item.type,
      price: `₹${item.price.toLocaleString("en-IN")}`,
      _order: getSortOrder(item.type)
    });
  });

  // Convert to array and sort
  return Object.values(grouped).sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)).map(card => {
    card.rows.sort((a, b) => a._order - b._order); // sort internal rows
    return card;
  });
};

function PriceTable({ data, accent }) {
  return (
    <div className="price-table-grid">
      {data.map((card) => (
        <div className={`price-size-card${card.size === "A4" || card.size === "A3" ? " featured-size" : ""}`} key={card.size}>
          <div className="price-size-header" style={{ borderColor: accent }}>
            <span className="price-size-label" style={{ color: accent }}>{card.size}</span>
            <span className="price-size-dim">{card.dimension}</span>
          </div>
          <ul className="price-size-rows">
            {card.rows.map((r) => (
              <li key={r.label} className="price-size-row">
                <span className="price-row-label">{r.label}</span>
                <span className="price-row-value">{r.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Pricing() {
  const [tab, setTab] = useState("bw");

  const [bwPricing, setBwPricing] = useState([]);
  const [colorPricing, setColorPricing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/pricing")
      .then(res => {
        const raw = Array.isArray(res.data) ? res.data : [];

        // Split data into the two tabs based on DB fields
        const bwData = raw.filter(item => item.colorType === "BlackWhite");
        const colorData = raw.filter(item => item.colorType !== "BlackWhite");

        // Group into card format
        setBwPricing(groupPricingData(bwData));
        setColorPricing(groupPricingData(colorData));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pricing-page">
      <Navbar />

      {/* Header */}
      <div className="pricing-hero">
        <p className="section-tag">Transparent Pricing</p>
        <h1 className="section-title">Portrait Pricing</h1>
        <p className="section-sub" style={{ maxWidth: 540, margin: "0 auto" }}>
          Every portrait is hand-drawn with pencil, graphite, or colour mediums. Prices vary by canvas size and number of subjects.
        </p>

        {/* Tab switcher */}
        <div className="pricing-tabs">
          <button
            className={`pricing-tab${tab === "bw" ? " active" : ""}`}
            onClick={() => setTab("bw")}
          >
            <FaHeart style={{ display: "inline-block", marginRight: "6px" }} /> Black &amp; White (Pencil / Graphite)
          </button>
          <button
            className={`pricing-tab${tab === "color" ? " active" : ""}`}
            onClick={() => setTab("color")}
          >
            <FaPalette style={{ display: "inline-block", marginRight: "6px" }} /> Colour Portraits (Premium)
          </button>
        </div>
      </div>

      {/* Pricing Tables */}
      <div className="pricing-table-section">
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center" }}><FaHourglassHalf /></p>
            <p>Loading pricing data…</p>
          </div>
        ) : (
          tab === "bw" ? (
            <>
              <div className="pricing-table-intro">
                <h2>Black &amp; White Portraits</h2>
                <p>Classic pencil and graphite work. Timeless and detailed.</p>
              </div>
              {bwPricing.length > 0 ? (
                <PriceTable data={bwPricing} accent="var(--charcoal)" />
              ) : (
                <p style={{ textAlign: "center", color: "var(--muted)", margin: "40px 0" }}>Pricing for this category is currently being updated.</p>
              )}
            </>
          ) : (
            <>
              <div className="pricing-table-intro">
                <h2>Colour Portraits <span className="premium-tag">Premium</span></h2>
                <p>Rich colour layering with premium materials. More time, more depth.</p>
              </div>
              {colorPricing.length > 0 ? (
                <PriceTable data={colorPricing} accent="var(--gold)" />
              ) : (
                <p style={{ textAlign: "center", color: "var(--muted)", margin: "40px 0" }}>Pricing for this category is currently being updated.</p>
              )}
            </>
          )
        )}
      </div>

      {/* Notes */}
      <div className="pricing-notes-section">
        <div className="pricing-notes-card">
          <h3>Good to Know</h3>
          <ul className="pricing-notes-list">
            <li><FaCamera style={{ marginRight: 6, color: "var(--gold)" }} /> Send a clear, well-lit reference photo for best results</li>
            <li><FaSync style={{ marginRight: 6, color: "var(--gold)" }} /> Unlimited revisions until you're 100% satisfied</li>
            <li><FaEye style={{ marginRight: 6, color: "var(--gold)" }} /> Digital preview shared before final framing</li>
            <li><FaTruck style={{ marginRight: 6, color: "var(--gold)" }} /> Free shipping across India</li>
            <li><FaCreditCard style={{ marginRight: 6, color: "var(--gold)" }} /> COD available · Secure online payment accepted</li>
            <li><FaClock style={{ marginRight: 6, color: "var(--gold)" }} /> Delivery in 5–15 days depending on size &amp; detailing</li>
          </ul>
        </div>
        <div className="pricing-cta-card">
          <h3>Ready to Order?</h3>
          <p>Place your commission now and we'll get started within 24 hours.</p>
          <Link to="/order">
            <button className="btn-primary" style={{ padding: "13px 32px", borderRadius: 8, marginTop: 16 }}>
              Place Your Order →
            </button>
          </Link>
          <p style={{ marginTop: 16, fontSize: "0.82rem", color: "var(--muted)" }}>
            Need a custom size or bulk order?{" "}
            <a href="mailto:hello@drawingspot.in" style={{ color: "var(--gold)", fontWeight: 600 }}>Email us</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Pricing;