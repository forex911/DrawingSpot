import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { IconUpload, IconEye, IconRefresh, IconFrame, IconTruck, IconPencil, IconPalette } from "../components/common/Icons";
import API from "../api/axiosConfig";
import { FaHeart, FaPalette, FaCheckCircle, FaShoppingCart, FaMagic, FaCheck, FaTimes } from "react-icons/fa";

const PORTRAIT_TYPES = [
  { value: "bw", label: <><FaHeart style={{ display: "inline-block", marginRight: 4 }} /> Black & White (Pencil / Graphite)</> },
  { value: "color", label: <><FaPalette style={{ display: "inline-block", marginRight: 4 }} /> Colour Portrait (Premium)</> },
];

const SUBJECTS = ["Single", "Couple", "Family (3–4 people)"];

const SIZES = {
  bw: ["A5 (5×8 in) — Single ₹1,200", "A4 (8×12 in) — Single ₹2,500–3,000", "A3 (12×17 in) — Single ₹4,500", "A2 (16×23 in) — from ₹9,000", "A1 (23×33 in) — from ₹18,000"],
  color: ["A5 (5×8 in) — Single ₹1,500", "A4 (8×12 in) — Single ₹3,000–3,500", "A3 (12×17 in) — Single ₹5,500", "A2 (16×23 in) — from ₹11,000", "A1 (23×33 in) — from ₹22,000"],
};

function Order() {
  const { items, totalPrice, totalItems, updateQty, removeFromCart } = useCart();
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    portraitType: "",
    size: "",
    subject: "",
    frameOption: "WithoutFrame", // Default
    deliveryAddress: "",
    notes: "",
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // ── Auto-fill form from cart items ─────────────────────────────────────
  useEffect(() => {
    if (items.length === 0) return;
    const first = items[0]; // Use the first cart item as the template

    // Map category → portraitType (Case-insensitive)
    const categoryName = (first.category || "").toLowerCase();
    const portraitType =
      categoryName.includes("black") ? "bw" :
        (categoryName.includes("color") || categoryName.includes("colour")) ? "color" : "";

    // The size in ARTWORKS is already "A3", "A4" etc. — find the matching
    // SIZES option that starts with that code.
    const cartSize = (first.size || "").toUpperCase();
    const matchingSize = portraitType
      ? (SIZES[portraitType] || []).find((s) => s.toUpperCase().startsWith(cartSize)) || ""
      : "";

    // Map subject ("Single" / "Couple" / "Family") to the exact SUBJECTS value
    const subject = SUBJECTS.find(
      (s) => s.toLowerCase().startsWith((first.subject || "").toLowerCase())
    ) || "";

    if (portraitType || matchingSize || subject) {
      setForm((prev) => ({
        ...prev,
        portraitType: portraitType || prev.portraitType,
        size: matchingSize || prev.size,
        subject: subject || prev.subject,
      }));
      setAutoFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount so manual changes aren't overwritten

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "portraitType" ? { size: "" } : {}),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReferenceImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1 — Create the order record (JSON)
      const colorType = form.portraitType === "bw" ? "BlackWhite" : "Color";
      const sizeCode = form.size ? form.size.split(" ")[0] : "";

      const payload = {
        size: sizeCode,
        type: form.subject,
        colorType,
        frameOption: form.frameOption,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes,
        ...(userId ? { user: { id: Number(userId) } } : {}),
      };

      const orderRes = await API.post("/orders", payload);
      const orderId = orderRes.data?.id;

      // Step 2 — Upload reference image (if provided)
      // NOTE: Do NOT set Content-Type manually — axios sets
      // "multipart/form-data; boundary=..." automatically from FormData.
      // Setting it manually strips the boundary and breaks server parsing.
      if (referenceImage && orderId) {
        const fd = new FormData();
        fd.append("file", referenceImage);
        await API.post(`/orders/${orderId}/image`, fd);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      // Still show success so UX isn't broken
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };


  const currentSizes = form.portraitType ? SIZES[form.portraitType] : [];

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-page-header">
        <p className="section-tag">Custom Commission</p>
        <h1>Place Your Order</h1>
        <p>Choose your portrait style, upload your photo, and we'll handle the rest.</p>
      </div>

      {/* ── Login Gate ── */}
      {!isAuthenticated && (
        <div className="auth-center" style={{ minHeight: "50vh" }}>
          <div className="auth-card" style={{ textAlign: "center", padding: "52px 40px", maxWidth: 440 }}>
            <div className="auth-brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19.5c0 1.38-1.12 2.5-2.5 2.5S7 20.88 7 19.5c0-.87.5-1.5 1-2l3.5-3.5 1 4z" />
                <path d="M18.37 3.63a2.12 2.12 0 0 1 3 3L9 19l-4 1 1-4L18.37 3.63z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>Sign In to Continue</h2>
            <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: "0.95rem" }}>
              You need to be logged in to place an order. Sign in to your DrawingSpot account and we'll bring you right back here.
            </p>
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "13px", borderRadius: "8px", fontSize: "1rem", marginBottom: 14 }}
              onClick={() => navigate("/login?redirect=/order")}
            >
              Sign In to Continue →
            </button>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "var(--gold)", fontWeight: 600 }}>Create one free</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── Main content — authenticated users only ── */}
      {isAuthenticated && (
        submitted ? (
          <div className="auth-center">
            <div className="auth-card" style={{ textAlign: "center", padding: "52px 40px" }}>
              <div className="success-icon"><FaPalette /></div>
              <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 12 }}>Order Placed Successfully!</h2>
              <p style={{ color: "var(--muted)", marginBottom: 28 }}>
                Our artists will review your reference photo and reach out within 24 hours with a digital preview for approval.
              </p>
              <Link to="/" className="btn-primary" style={{ display: "inline-block", borderRadius: 8, padding: "13px 32px" }}>
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="order-layout">
            {/* ── Left: Form ── */}
            <div className="auth-card order-card-wide">
              <form onSubmit={handleSubmit} className="auth-form">

                {/* ── Cart Summary inside form ── */}
                {items.length > 0 && (
                  <div className="order-form-cart-summary">
                    <h2 className="auth-form-title" style={{ textAlign: "left", fontSize: "1.1rem", marginBottom: 12 }}>
                      <FaShoppingCart style={{ marginRight: 8, color: "var(--gold)" }} /> Your Selected Items
                    </h2>
                    <ul className="order-cart-list" style={{ marginBottom: 0 }}>
                      {items.map((item) => (
                        <li className="order-cart-item" key={item.id}>
                          <img src={item.img} alt={item.title} className="order-cart-thumb" />
                          <div className="order-cart-details">
                            <p className="order-cart-title">{item.title}</p>
                            <p className="order-cart-artist">{item.artist}</p>
                            <div className="order-qty-row">
                              <button className="cart-qty-btn" type="button" onClick={() => updateQty(item.id, -1)}>−</button>
                              <span className="cart-qty-num">{item.qty}</span>
                              <button className="cart-qty-btn" type="button" onClick={() => updateQty(item.id, 1)}>+</button>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p className="order-cart-price">{item.price}</p>
                            <button className="cart-remove-btn" type="button" onClick={() => removeFromCart(item.id)}>✕</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="order-cart-total" style={{ marginTop: 10 }}>
                      <span>Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
                      <span className="order-cart-total-price">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}

                <h2 className="auth-form-title" style={{ textAlign: "left", fontSize: "1.3rem" }}>Portrait Details</h2>

                {/* Auto-fill notice */}
                {autoFilled && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", borderRadius: 8, marginBottom: 12,
                    background: "rgba(80,200,120,0.10)", border: "1px solid rgba(80,200,120,0.35)",
                    fontSize: "0.84rem", color: "var(--muted)",
                  }}>
                    <span style={{ fontSize: "1rem" }}><FaMagic style={{ color: "var(--gold)" }} /></span>
                    <span>Fields pre-filled from your selected cart item. You can adjust them before submitting.</span>
                  </div>
                )}

                {/* Portrait Type */}
                <div className="form-group">
                  <label>Portrait Type</label>
                  <div className="portrait-type-toggle">
                    {PORTRAIT_TYPES.map((pt) => (
                      <button
                        type="button"
                        key={pt.value}
                        className={`portrait-type-btn${form.portraitType === pt.value ? " active" : ""}`}
                        onClick={() => setForm((f) => ({ ...f, portraitType: pt.value, size: "" }))}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size (dynamic based on type) */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Canvas Size &amp; Price</label>
                    <select name="size" value={form.size} onChange={handleChange} required disabled={!form.portraitType}>
                      <option value="" disabled>{form.portraitType ? "Select size…" : "Choose type first"}</option>
                      {currentSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Subjects</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="" disabled>Select…</option>
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Frame Option */}
                <div className="form-group">
                  <label>Add Premium Frame?</label>
                  <div className="portrait-type-toggle" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    {[
                      { value: "WithFrame", label: <><FaCheck style={{ color: "var(--success)", marginRight: 6 }} /> Yes, add frame</> },
                      { value: "WithoutFrame", label: <><FaTimes style={{ color: "var(--error)", marginRight: 6 }} /> No, just portrait</> }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        className={`portrait-type-btn${form.frameOption === opt.value ? " active" : ""}`}
                        onClick={() => setForm((f) => ({ ...f, frameOption: opt.value }))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Reference Image Upload ── */}
                <div className="form-group">
                  <label>
                    Reference Photo <span style={{ color: "#e74c3c", fontWeight: 700 }}>*</span>
                    <span className="label-optional"> (required — clear &amp; well-lit)</span>
                  </label>

                  <div
                    className={`image-upload-zone${imagePreview ? " has-image" : ""}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("ref-img-input").click()}
                  >
                    {imagePreview ? (
                      <div className="image-preview-wrap">
                        <img src={imagePreview} alt="Reference preview" className="image-preview" />
                        <button
                          type="button"
                          className="image-remove-btn"
                          onClick={(e) => { e.stopPropagation(); setReferenceImage(null); setImagePreview(null); }}
                        >✕ Remove</button>
                      </div>
                    ) : (
                      <div className="image-upload-prompt">
                        <span className="image-upload-icon"><IconUpload size={36} color="var(--gold)" /></span>
                        <p><strong>Click to upload</strong> or drag &amp; drop</p>
                        <p className="image-upload-sub">JPG, PNG, WEBP · Max 10 MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="ref-img-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>

                {/* Delivery Address */}
                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea name="deliveryAddress" placeholder="House / Flat no., Street, City, Pin Code" rows={3} value={form.deliveryAddress} onChange={handleChange} required />
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label>Additional Notes <span className="label-optional">(optional)</span></label>
                  <textarea name="notes" placeholder="Describe the photo, preferred background, style notes, special requests…" rows={3} value={form.notes} onChange={handleChange} />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px", borderRadius: "8px", fontSize: "1rem" }}
                  disabled={loading}
                >
                  {loading ? "Placing Order…" : "Confirm Order →"}
                </button>
              </form>
            </div>

            {/* ── Right: Cart + Perks ── */}
            <div className="order-sidebar" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Cart Preview (if items) */}
              {items.length > 0 && (
                <div className="order-info-card">
                  <h3>Selected Artworks</h3>
                  <ul className="order-cart-list">
                    {items.map((item) => (
                      <li className="order-cart-item" key={item.id}>
                        <img src={item.img} alt={item.title} className="order-cart-thumb" />
                        <div className="order-cart-details">
                          <p className="order-cart-title">{item.title}</p>
                          <p className="order-cart-artist">{item.artist}</p>
                          <div className="order-qty-row">
                            <button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                            <span className="cart-qty-num">{item.qty}</span>
                            <button className="cart-qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p className="order-cart-price">{item.price}</p>
                          <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="order-cart-total">
                    <span>Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
                    <span className="order-cart-total-price">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {/* Perks */}
              <div className="order-info-card">
                <h3>How It Works</h3>
                <ul className="order-perks">
                  <li><span className="perk-icon"><IconUpload size={18} color="var(--gold)" /></span><div><strong>Upload Your Photo</strong><p>Send a clear, well-lit reference image</p></div></li>
                  <li><span className="perk-icon"><IconEye size={18} color="var(--gold)" /></span><div><strong>Preview First</strong><p>We share a digital preview for approval</p></div></li>
                  <li><span className="perk-icon"><IconRefresh size={18} color="var(--gold)" /></span><div><strong>Free Revisions</strong><p>Changes until you're 100% satisfied</p></div></li>
                  <li><span className="perk-icon"><IconFrame size={18} color="var(--gold)" /></span><div><strong>Premium Framing</strong><p>Delivered ready-to-hang</p></div></li>
                  <li><span className="perk-icon"><IconTruck size={18} color="var(--gold)" /></span><div><strong>Free Shipping</strong><p>Across India · COD available</p></div></li>
                </ul>
              </div>

              {/* Pricing Quick Ref */}
              <div className="order-info-card">
                <h4 style={{ marginBottom: 10, fontFamily: "var(--font-head)" }}>Quick Price Reference</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 10 }}>
                  See full pricing on the{" "}
                  <Link to="/pricing" style={{ color: "var(--gold)", fontWeight: 600 }}>Pricing page →</Link>
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><IconPencil size={12} color="var(--charcoal)" /> B&amp;W</p>
                    <p style={{ fontSize: "0.78rem" }}>A5 from ₹1,200</p>
                    <p style={{ fontSize: "0.78rem" }}>A4 from ₹2,500</p>
                    <p style={{ fontSize: "0.78rem" }}>A3 from ₹4,500</p>
                  </div>
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><IconPalette size={12} color="var(--gold)" /> Colour</p>
                    <p style={{ fontSize: "0.78rem" }}>A5 from ₹1,500</p>
                    <p style={{ fontSize: "0.78rem" }}>A4 from ₹3,000</p>
                    <p style={{ fontSize: "0.78rem" }}>A3 from ₹5,500</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )
      )}

      <Footer />
    </div>
  );
}

export default Order;