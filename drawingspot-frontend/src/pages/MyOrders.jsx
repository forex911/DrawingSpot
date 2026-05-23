import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
    FaMailBulk, FaPencilAlt, FaCheckCircle, FaPalette, FaExclamationTriangle,
    FaImage, FaHeart, FaTimesCircle, FaHourglassHalf, FaPaintBrush, FaBoxOpen,
    FaCheck, FaTimes, FaClock, FaTrash
} from "react-icons/fa";

// ── Progress Steps ──────────────────────────────────────────────────────────
const STEPS = [
    { key: "Received", icon: <FaMailBulk />, label: "Received", desc: "We've received your order" },
    { key: "Sketching", icon: <FaPencilAlt />, label: "Sketching", desc: "Our artist is working on it" },
    { key: "Delivered", icon: <FaCheckCircle />, label: "Delivered", desc: "Your portrait is on the way!" },
];

function getStepIndex(status) {
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
}

// ── Order Progress Stepper ──────────────────────────────────────────────────
function OrderStepper({ status }) {
    const current = getStepIndex(status);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "20px 0 14px" }}>
            {STEPS.map((step, i) => {
                const done = i <= current;
                const active = i === current;
                return (
                    <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                        {/* Step circle */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1.2rem",
                                background: done
                                    ? (active ? "var(--gold)" : "rgba(212,175,55,0.18)")
                                    : "var(--card)",
                                border: `2px solid ${done ? "var(--gold)" : "var(--border)"}`,
                                transition: "all 0.3s",
                                boxShadow: active ? "0 0 0 4px rgba(212,175,55,0.2)" : "none",
                            }}>
                                {step.icon}
                            </div>
                            <p style={{
                                fontSize: "0.72rem", fontWeight: active ? 700 : 500,
                                color: done ? "var(--gold)" : "var(--muted)",
                                marginTop: 6, textAlign: "center", whiteSpace: "nowrap",
                            }}>
                                {step.label}
                            </p>
                        </div>

                        {/* Connector line */}
                        {i < STEPS.length - 1 && (
                            <div style={{
                                flex: 1, height: 3, borderRadius: 2, margin: "0 4px",
                                marginBottom: 22,
                                background: i < current ? "var(--gold)" : "var(--border)",
                                transition: "background 0.4s",
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Status Badge ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    Received: { bg: "rgba(212,175,55,0.15)", color: "#D4AF37" },
    Sketching: { bg: "rgba(100,149,237,0.15)", color: "#6495ED" },
    Delivered: { bg: "rgba(50,205,80,0.15)", color: "#50C878" },
    Cancelled: { bg: "rgba(255,69,58,0.12)", color: "#FF453A" },
};
function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || { bg: "rgba(150,150,150,0.12)", color: "#999" };
    return (
        <span style={{
            padding: "3px 12px", borderRadius: 30, fontSize: "0.76rem", fontWeight: 700,
            background: s.bg, color: s.color,
        }}>
            {status || "Unknown"}
        </span>
    );
}

// ── Format date ─────────────────────────────────────────────────────────────
function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
}

// ── Main Component ──────────────────────────────────────────────────────────
function MyOrders() {
    const { isAuthenticated, userId, userName } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError("");
        try {
            const res = await API.get(`/orders/user/${userId}`);
            const data = Array.isArray(res.data) ? res.data : [];
            // Sort newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(data);
        } catch {
            setError("Couldn't load your orders. Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

        try {
            await API.put(`/orders/${orderId}/status?status=Cancelled`);
            await fetchOrders(); // Refresh after cancellation
        } catch (err) {
            console.error("Cancellation error:", err);
            alert("Could not cancel order. Please try again or contact support.");
        }
    };

    useEffect(() => {
        if (!isAuthenticated) { navigate("/login?redirect=/my-orders"); return; }
        fetchOrders();
    }, [isAuthenticated, fetchOrders, navigate]);

    return (
        <div className="auth-page">
            <Navbar />

            {/* Header */}
            <div className="auth-page-header">
                <p className="section-tag">Your Account</p>
                <h1>My Orders</h1>
                <p style={{ color: "var(--muted)", textAlign: "center", width: "100%" }}>
                    {userName ? `Welcome back, ${userName} \u{1F600}` : ""}
                </p>
            </div>

            <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 5% 60px" }}>

                {/* Toolbar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                        {!loading && `${orders.length} order${orders.length !== 1 ? "s" : ""} found`}
                    </p>
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        style={{
                            padding: "8px 18px", borderRadius: 8, fontSize: "0.84rem",
                            border: "1.5px solid var(--border)", background: "var(--card)",
                            color: "var(--text)", cursor: "pointer", fontWeight: 600,
                        }}
                    >
                        {loading ? "↺ Loading…" : "↺ Refresh"}
                    </button>
                </div>

                {/* States */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
                        <p style={{ fontSize: "2.5rem", marginBottom: 12, display: "flex", justifyContent: "center" }}><FaPalette /></p>
                        <p>Loading your orders…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="auth-error" style={{ marginBottom: 20 }}>
                        <FaExclamationTriangle style={{ marginRight: "8px" }} /> {error}
                        <button onClick={fetchOrders}
                            style={{ marginLeft: 12, fontSize: "0.82rem", color: "var(--gold)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="auth-card" style={{ textAlign: "center", padding: "60px 40px", maxWidth: 480, margin: "40px auto" }}>
                        <p style={{ fontSize: "3rem", marginBottom: 14, display: "flex", justifyContent: "center" }}><FaImage /></p>
                        <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>No orders yet</h3>
                        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
                            You haven't placed any portrait commissions yet.
                            Start by choosing a style!
                        </p>
                        <Link to="/order" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 8 }}>
                            Place Your First Order →
                        </Link>
                    </div>
                )}

                {/* Order Cards */}
                {!loading && orders.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {orders.map((order) => {
                            const isOpen = expanded === order.id;
                            const step = getStepIndex(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="auth-card"
                                    style={{ padding: "20px 24px", cursor: "default", overflow: "hidden" }}
                                >
                                    {/* Card Header */}
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, cursor: "pointer" }}
                                        onClick={() => setExpanded(isOpen ? null : order.id)}
                                    >
                                        <div style={{ display: "flex", gap: 14 }}>
                                            {/* Mini Thumbnail */}
                                            {order.referenceImagePath && (() => {
                                                const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api").replace("/api", "");
                                                const fullPath = order.referenceImagePath.startsWith("http") ? order.referenceImagePath : `${baseUrl}${order.referenceImagePath}`;
                                                return (
                                                <img
                                                    src={fullPath}
                                                    alt="Thumbnail"
                                                    style={{
                                                        width: 44, height: 44, borderRadius: 8,
                                                        objectFit: "cover", border: "1px solid var(--border)",
                                                        background: "var(--card-hover)"
                                                    }}
                                                />
                                                );
                                            })()}
                                            <div>
                                                <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                                                    Order #{order.id} · {formatDate(order.createdAt)}
                                                </p>
                                                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.05rem", marginBottom: 0 }}>
                                                    {order.colorType === "BlackWhite" ? <><FaHeart style={{ display: "inline-block", marginRight: 4 }} /> B&W</> : <><FaPalette style={{ display: "inline-block", marginRight: 4 }} /> Colour</>} · {order.size || "—"} · {order.type || "—"}
                                                </h3>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <StatusBadge status={order.status} />
                                            <span style={{ fontSize: "0.8rem", color: "var(--muted)", userSelect: "none" }}>
                                                {isOpen ? "▲" : "▼"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Stepper — always visible */}
                                    <OrderStepper status={order.status} />

                                    {/* Progress message */}
                                    <p style={{ fontSize: "0.83rem", color: "var(--muted)", marginBottom: isOpen ? 16 : 0 }}>
                                        {order.status === "Cancelled" && <><FaTimesCircle /> This order has been cancelled.</>}
                                        {order.status !== "Cancelled" && step === 0 && <><FaHourglassHalf /> Your order is in our queue. We'll start sketching soon!</>}
                                        {order.status !== "Cancelled" && step === 1 && <><FaPaintBrush /> Our artist is currently working on your portrait. Hang tight!</>}
                                        {order.status !== "Cancelled" && step === 2 && <><FaBoxOpen /> Your portrait has been delivered. We hope you love it!</>}
                                    </p>

                                    {/* Expanded Detail Panel */}
                                    {isOpen && (
                                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 14 }}>

                                            {/* Meta grid */}
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px 20px" }}>
                                                {[
                                                    ["Portrait Type", order.colorType === "BlackWhite" ? "Black & White" : "Colour"],
                                                    ["Canvas Size", order.size],
                                                    ["Subject", order.type],
                                                    ["Frame", order.frameOption === "WithFrame" ? <><FaCheck style={{ color: "var(--success)" }} /> Premium Frame</> : <><FaTimes style={{ color: "var(--error)" }} /> No Frame</>],
                                                    ["Price", order.price ? `₹${Number(order.price).toLocaleString("en-IN")}` : "Will be confirmed"],
                                                    ["Order Date", formatDate(order.createdAt)],
                                                ].map(([label, val]) => (
                                                    <div key={label}>
                                                        <p style={{ fontSize: "0.67rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
                                                        <p style={{ fontSize: "0.88rem", fontWeight: 600 }}>{val || "—"}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Reference image */}
                                            {order.referenceImagePath && (() => {
                                                const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api").replace("/api", "");
                                                const fullPath = order.referenceImagePath.startsWith("http") ? order.referenceImagePath : `${baseUrl}${order.referenceImagePath}`;
                                                return (
                                                <div>
                                                    <p style={{ fontSize: "0.67rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Your Reference Photo</p>
                                                    <a href={fullPath} target="_blank" rel="noreferrer">
                                                        <img
                                                            src={fullPath}
                                                            alt="Reference"
                                                            style={{
                                                                width: 100, height: 100, objectFit: "cover",
                                                                borderRadius: 10, border: "1.5px solid var(--border)",
                                                                transition: "opacity 0.15s", cursor: "pointer",
                                                            }}
                                                            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
                                                            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                                                        />
                                                    </a>
                                                </div>
                                                );
                                            })()}

                                            {/* Delivery address */}
                                            {order.deliveryAddress && (
                                                <div>
                                                    <p style={{ fontSize: "0.67rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Delivery Address</p>
                                                    <p style={{ fontSize: "0.86rem" }}>{order.deliveryAddress}</p>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {order.notes && (
                                                <div>
                                                    <p style={{ fontSize: "0.67rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Your Notes</p>
                                                    <p style={{ fontSize: "0.86rem", fontStyle: "italic", color: "var(--muted)" }}>{order.notes}</p>
                                                </div>
                                            )}

                                            {/* What's next / Cancel Action */}
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
                                                {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                                    <div style={{
                                                        padding: "12px 16px", borderRadius: 10, flex: 1, minWidth: 260,
                                                        background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)",
                                                    }}>
                                                        <p style={{ fontSize: "0.8rem", color: "var(--gold)", fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><FaClock /> What's next?</p>
                                                        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                                                            {order.status === "Received"
                                                                ? "We'll send you a preview for approval before finalising the portrait. Expect to hear from us within 24–48 hours."
                                                                : "An artist is working on your portrait. You'll receive a digital preview shortly for any final tweaks before delivery."}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Cancel Button */}
                                                {order.status === "Received" && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                                                        style={{
                                                            padding: "10px 16px", borderRadius: 8, fontSize: "0.8rem",
                                                            border: "1.2px solid #FF453A", background: "none",
                                                            color: "#FF453A", cursor: "pointer", fontWeight: 600,
                                                            transition: "all 0.2s"
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,69,58,0.08)"; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                                                    >
                                                        <FaTrash style={{ marginRight: 6 }} /> Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom CTA */}
                {!loading && orders.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: 36 }}>
                        <Link to="/order" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 8, marginRight: 12 }}>
                            + Place Another Order
                        </Link>
                        <Link to="/dashboard" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                            ← Back to Dashboard
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MyOrders;
