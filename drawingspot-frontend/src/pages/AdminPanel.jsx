import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import UserChat from "../components/common/UserChat";
import { useAuth } from "../context/AuthContext";
import { FaMailBulk, FaPencilAlt, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaLock, FaCog, FaBox, FaCommentDots, FaHourglassHalf, FaExclamationTriangle, FaInbox, FaHeart, FaPalette, FaCheck, FaTimes, FaSearchPlus, FaEnvelope } from "react-icons/fa";
import "../App.css";

const POLL_INTERVAL = 10000; // auto-refresh every 10 seconds

const STATUS_CONFIG = {
    Received: { bg: "rgba(212,175,55,0.15)", color: "#D4AF37", icon: <FaMailBulk /> },
    Sketching: { bg: "rgba(100,149,237,0.15)", color: "#6495ED", icon: <FaPencilAlt /> },
    Delivered: { bg: "rgba(50,205,50,0.15)", color: "#50C878", icon: <FaCheckCircle /> },
    Cancelled: { bg: "rgba(255,69,58,0.12)", color: "#FF453A", icon: <FaTimesCircle /> },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || { bg: "rgba(150,150,150,0.15)", color: "#999", icon: <FaQuestionCircle /> };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 30,
            fontSize: "0.78rem", fontWeight: 700,
            background: cfg.bg, color: cfg.color,
        }}>
            {cfg.icon} {status || "Unknown"}
        </span>
    );
}

function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function formatTime(date) {
    if (!date) return "";
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ─── Main Admin Panel ─── */
function AdminPanel() {
    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();

    // Redirect non-admins
    useEffect(() => {
        if (!isAuthenticated || userRole !== "ADMIN") {
            navigate("/");
        }
    }, [isAuthenticated, userRole, navigate]);
    const [viewMode, setViewMode] = useState("Orders"); // "Orders" or "Chats"
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [chatSearch, setChatSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [updating, setUpdating] = useState(null);
    const [localPrices, setLocalPrices] = useState({}); // orderId -> price
    const [lastUpdated, setLastUpdated] = useState(null);
    const [selectedUserChat, setSelectedUserChat] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [feedbacks, setFeedbacks] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [pricing, setPricing] = useState([]);
    const [galleryForm, setGalleryForm] = useState({ imageUrl: "", category: "Single", description: "" });
    const [pricingForm, setPricingForm] = useState({ size: "", type: "Single", colorType: "Color", price: "" });
    const pollerRef = useRef(null);

    // ── Fetch orders ──────────────────────────────────────────
    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await API.get("/orders");
            const data = Array.isArray(res.data) ? res.data : [];
            // Sort newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(data);
            setError("");
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Admin fetch error:", err);
            if (!silent) {
                setError("Could not load orders — make sure the Spring Boot backend is running on port 8080.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // ── Fetch Unread Counts ───────────────────────────────────
    const fetchUnreadCounts = useCallback(async () => {
        try {
            const res = await API.get("/chat/admin/unread-counts");
            setUnreadCounts(res.data || {});
        } catch (err) {
            console.error("Could not fetch unread counts", err);
        }
    }, []);

    // ── Fetch Feedbacks ───────────────────────────────────────
    const fetchFeedbacks = useCallback(async () => {
        try {
            const res = await API.get("/feedback");
            setFeedbacks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Could not fetch feedbacks", err);
        }
    }, []);

    // ── Fetch Gallery ─────────────────────────────────────────
    const fetchGallery = useCallback(async () => {
        try {
            const res = await API.get("/gallery");
            setGallery(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Could not fetch gallery", err);
        }
    }, []);

    // ── Fetch Pricing ─────────────────────────────────────────
    const fetchPricing = useCallback(async () => {
        try {
            const res = await API.get("/pricing");
            setPricing(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Could not fetch pricing", err);
        }
    }, []);

    // ── Start polling ────────────────────────────
    useEffect(() => {
        if (userRole !== "ADMIN") return;

        fetchOrders(false); // initial load
        fetchUnreadCounts();
        fetchFeedbacks();
        fetchGallery();
        fetchPricing();
        // Auto-refresh every 10 seconds
        pollerRef.current = setInterval(() => {
            fetchOrders(true);
            fetchUnreadCounts();
        }, POLL_INTERVAL);
        return () => {
            if (pollerRef.current) clearInterval(pollerRef.current);
        };
    }, [userRole, fetchOrders, fetchUnreadCounts]);

    // ── Status update ─────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        // Optimistic UI update
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
        try {
            await API.put(`/orders/${orderId}/status?status=${newStatus}`);
            setLastUpdated(new Date());
        } catch {
            alert("Failed to update status — is the backend running?");
            // Revert on failure by re-fetching
            fetchOrders(true);
        } finally {
            setUpdating(null);
        }
    };

    const handlePriceChange = async (orderId, newPrice) => {
        setUpdating(orderId);
        // Optimistic UI update
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, price: newPrice } : o));
        try {
            await API.put(`/orders/${orderId}/price?price=${newPrice}`);
            setLastUpdated(new Date());
        } catch {
            alert("Failed to update price — is the backend running?");
            // Revert on failure by re-fetching
            fetchOrders(true);
        } finally {
            setUpdating(null);
        }
    };

    // ── Manage Gallery & Pricing Actions ──────────────────────
    const handleAddGallery = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/gallery", galleryForm);
            setGallery([...gallery, res.data]);
            setGalleryForm({ imageUrl: "", category: "Single", description: "" });
        } catch (err) {
            alert("Failed to add gallery item");
            console.error(err);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm("Delete this image from gallery?")) return;
        try {
            await API.delete(`/gallery/${id}`);
            setGallery(gallery.filter(g => g.id !== id));
        } catch (err) {
            alert("Failed to delete gallery item");
            console.error(err);
        }
    };

    const handleAddPricing = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/pricing", { ...pricingForm, price: parseFloat(pricingForm.price) });
            setPricing([...pricing, res.data]);
            setPricingForm({ size: "", type: "Single", colorType: "Color", price: "" });
        } catch (err) {
            alert("Failed to add pricing rule");
            console.error(err);
        }
    };

    const handleDeletePricing = async (id) => {
        if (!window.confirm("Delete this pricing rule?")) return;
        try {
            await API.delete(`/pricing/${id}`);
            setPricing(pricing.filter(p => p.id !== id));
        } catch (err) {
            alert("Failed to delete pricing rule");
            console.error(err);
        }
    };

    if (userRole !== "ADMIN") return null;

    // ── Filter & search ───────────────────────────────────────
    const filtered = orders.filter((o) => {
        const matchStatus = filter === "All" || o.status === filter;
        const q = search.toLowerCase();
        const matchSearch = !q
            || String(o.id).includes(q)
            || (o.deliveryAddress || "").toLowerCase().includes(q)
            || (o.type || "").toLowerCase().includes(q)
            || (o.size || "").toLowerCase().includes(q)
            || (o.colorType || "").toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const counts = {
        All: orders.length,
        Received: orders.filter((o) => o.status === "Received").length,
        Sketching: orders.filter((o) => o.status === "Sketching").length,
        Delivered: orders.filter((o) => o.status === "Delivered").length,
    };

    // ── Compute Users from Orders ─────────────────────────────
    const chatUsers = Array.from(new Map(
        orders.filter(o => o.user).map(o => [o.user.id, o.user])
    ).values());

    return (
        <div className="auth-page">
            <Navbar />

            <div className="auth-page-header">
                <p className="section-tag" style={{ color: "#e74c3c", display: "inline-flex", alignItems: "center", gap: "6px" }}><FaCog /> Admin Only</p>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16, flexWrap: "wrap", marginTop: 8 }}>
                    <button
                        onClick={() => setViewMode("Orders")}
                        style={{
                            padding: "8px 24px", borderRadius: 30, fontSize: "1.05rem", fontWeight: 700,
                            background: viewMode === "Orders" ? "var(--text)" : "transparent",
                            color: viewMode === "Orders" ? "var(--bg)" : "var(--muted)",
                            border: `2px solid ${viewMode === "Orders" ? "var(--text)" : "var(--border)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        <FaBox style={{ marginRight: 6 }} /> Orders
                    </button>
                    <button
                        onClick={() => setViewMode("Chats")}
                        style={{
                            padding: "8px 24px", borderRadius: 30, fontSize: "1.05rem", fontWeight: 700,
                            background: viewMode === "Chats" ? "var(--gold)" : "transparent",
                            color: viewMode === "Chats" ? "#000" : "var(--muted)",
                            border: `2px solid ${viewMode === "Chats" ? "var(--gold)" : "var(--border)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        <FaCommentDots style={{ marginRight: 6 }} /> Chats
                    </button>
                    <button
                        onClick={() => { setViewMode("Feedbacks"); fetchFeedbacks(); }}
                        style={{
                            padding: "8px 24px", borderRadius: 30, fontSize: "1.05rem", fontWeight: 700,
                            background: viewMode === "Feedbacks" ? "#e74c3c" : "transparent",
                            color: viewMode === "Feedbacks" ? "#fff" : "var(--muted)",
                            border: `2px solid ${viewMode === "Feedbacks" ? "#e74c3c" : "var(--border)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        <FaEnvelope style={{ marginRight: 6 }} /> Feedbacks
                        {feedbacks.length > 0 && (
                            <span style={{ marginLeft: 8, background: "#fff", color: "#e74c3c", fontSize: "0.72rem", fontWeight: 800, borderRadius: 12, padding: "1px 7px" }}>
                                {feedbacks.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setViewMode("Gallery"); fetchGallery(); }}
                        style={{
                            padding: "8px 24px", borderRadius: 30, fontSize: "1.05rem", fontWeight: 700,
                            background: viewMode === "Gallery" ? "#9b59b6" : "transparent",
                            color: viewMode === "Gallery" ? "#fff" : "var(--muted)",
                            border: `2px solid ${viewMode === "Gallery" ? "#9b59b6" : "var(--border)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        <FaPalette style={{ marginRight: 6 }} /> Gallery
                    </button>
                    <button
                        onClick={() => { setViewMode("Pricing"); fetchPricing(); }}
                        style={{
                            padding: "8px 24px", borderRadius: 30, fontSize: "1.05rem", fontWeight: 700,
                            background: viewMode === "Pricing" ? "#2ecc71" : "transparent",
                            color: viewMode === "Pricing" ? "#fff" : "var(--muted)",
                            border: `2px solid ${viewMode === "Pricing" ? "#2ecc71" : "var(--border)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        <FaPencilAlt style={{ marginRight: 6 }} /> Pricing
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                    {viewMode === "Orders" && (
                        <p style={{ color: "var(--muted)" }}>
                            {orders.length} total order{orders.length !== 1 ? "s" : ""}
                        </p>
                    )}
                    {/* Live indicator */}
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: "0.78rem", color: "#50C878", fontWeight: 600,
                    }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: "50%", background: "#50C878",
                            boxShadow: "0 0 0 2px rgba(80,200,120,0.3)",
                            animation: "pulse 1.8s infinite",
                            display: "inline-block",
                        }} />
                        LIVE — refreshes every 10s
                    </span>
                    {lastUpdated && (
                        <span style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                            Last synced: {formatTime(lastUpdated)}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 5%" }}>

                {viewMode === "Orders" && (
                    <>
                        {/* Toolbar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
                            <input
                                type="text"
                                placeholder="Search by ID, size, type, address…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 8,
                                    border: "1.5px solid var(--border)", background: "var(--card)",
                                    color: "var(--text)", fontSize: "0.92rem", outline: "none",
                                }}
                            />
                            <button
                                onClick={() => fetchOrders(false)}
                                disabled={loading || refreshing}
                                style={{
                                    padding: "10px 20px", borderRadius: 8, fontSize: "0.88rem",
                                    border: "1.5px solid var(--border)", background: "var(--card)",
                                    color: "var(--text)", cursor: "pointer", fontWeight: 600,
                                    opacity: loading || refreshing ? 0.6 : 1,
                                    display: "flex", alignItems: "center", gap: 6,
                                }}
                            >
                                {refreshing ? "↺ Syncing…" : "↺ Refresh Now"}
                            </button>
                        </div>

                        {/* Stats / Filter Cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                            {["All", "Received", "Sketching", "Delivered"].map((s) => {
                                const cfg = STATUS_CONFIG[s] || {};
                                const isActive = filter === s;
                                return (
                                    <div key={s} onClick={() => setFilter(s)} style={{
                                        background: isActive ? (cfg.bg || "rgba(212,175,55,0.12)") : "var(--card)",
                                        border: `1.5px solid ${isActive ? (cfg.color || "#D4AF37") : "var(--border)"}`,
                                        borderRadius: 12, padding: "16px 20px", cursor: "pointer",
                                        transition: "all 0.18s",
                                    }}>
                                        <p style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-head)", marginBottom: 2, color: cfg.color || "var(--text)" }}>
                                            {counts[s]}
                                        </p>
                                        <p style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 600 }}>{s}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* States */}
                        {loading && (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                                <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center" }}><FaHourglassHalf /></p>
                                <p>Fetching orders from database…</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="auth-error" style={{ marginBottom: 20 }}>
                                <strong><FaExclamationTriangle style={{ marginRight: 6 }} /> Backend Error:</strong> {error}
                                <div style={{ marginTop: 10 }}>
                                    <button onClick={() => fetchOrders(false)}
                                        style={{ padding: "8px 16px", borderRadius: 7, border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", cursor: "pointer", fontSize: "0.85rem" }}>
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {!loading && !error && filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                                <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center" }}><FaInbox /></p>
                                <p>{orders.length === 0 ? "No orders in the database yet." : "No orders match your filter."}</p>
                            </div>
                        )}

                        {/* Order Cards */}
                        {!loading && filtered.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {filtered.map((order) => (
                                    <div key={order.id} className="auth-card" style={{ padding: "20px 24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                                            <div>
                                                <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                                                    Order #{order.id} · {formatDate(order.createdAt)}
                                                </p>
                                                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1rem", marginBottom: 0 }}>
                                                    {order.colorType === "BlackWhite" ? <><FaHeart style={{ display: "inline-block", marginRight: 4 }} /> B&W</> : <><FaPalette style={{ display: "inline-block", marginRight: 4 }} /> Colour</>} · {order.size || "—"} · {order.type || "—"}
                                                </h3>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                <StatusBadge status={order.status} />
                                                <select
                                                    value={order.status || "Received"}
                                                    disabled={updating === order.id}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    style={{
                                                        padding: "5px 10px", borderRadius: 7, fontSize: "0.8rem",
                                                        border: "1.5px solid var(--border)", background: "var(--card)",
                                                        color: "var(--text)", cursor: "pointer",
                                                    }}
                                                >
                                                    <option>Received</option>
                                                    <option>Sketching</option>
                                                    <option>Delivered</option>
                                                    <option>Cancelled</option>
                                                </select>
                                                {updating === order.id && <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Saving…</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px 20px" }}>
                                            {[
                                                ["Size", order.size],
                                                ["Subject", order.type],
                                                ["Style", order.colorType === "BlackWhite" ? "B&W" : order.colorType],
                                                ["Frame", order.frameOption === "WithFrame" ? <><FaCheck style={{ color: "var(--success)", marginRight: 4 }} /> Frame</> : <><FaTimes style={{ color: "var(--error)", marginRight: 4 }} /> No Frame</>],
                                                ["Customer", order.user],
                                            ].map(([label, val]) => (
                                                <div key={label}>
                                                    <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
                                                    {label === "Customer" ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{val ? (val.name || val.id) : "—"}</span>
                                                            {val && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedUserChat(val.id);
                                                                        setViewMode("Chats");
                                                                    }}
                                                                    style={{ padding: "4px 8px", fontSize: "0.7rem", borderRadius: 4, background: "rgba(212,175,55,0.15)", border: "1px solid var(--gold)", color: "var(--gold)", cursor: "pointer" }}
                                                                >
                                                                    <FaCommentDots style={{ marginRight: 6 }} /> Message User
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p style={{ fontSize: "0.88rem", fontWeight: 600 }}>{val || "—"}</p>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Price Editing */}
                                            <div>
                                                <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Price (₹)</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <input
                                                        type="number"
                                                        value={localPrices[order.id] !== undefined ? localPrices[order.id] : (order.price || "")}
                                                        onChange={(e) => setLocalPrices(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                        placeholder="TBD"
                                                        disabled={updating === order.id}
                                                        style={{
                                                            width: 80, padding: "6px 10px", borderRadius: 6,
                                                            border: "1.5px solid var(--border)", background: "var(--card)",
                                                            color: "var(--gold)", fontSize: "0.88rem", fontWeight: 700,
                                                            outline: "none",
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const val = parseFloat(localPrices[order.id]);
                                                            if (!isNaN(val)) {
                                                                handlePriceChange(order.id, val);
                                                            } else if (localPrices[order.id] === "") {
                                                                handlePriceChange(order.id, 0);
                                                            }
                                                        }}
                                                        disabled={updating === order.id || localPrices[order.id] === undefined || parseFloat(localPrices[order.id]) === order.price}
                                                        style={{
                                                            padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem",
                                                            background: "var(--gold)", color: "#000", fontWeight: 700,
                                                            border: "none", cursor: "pointer",
                                                            opacity: (updating === order.id || localPrices[order.id] === undefined || parseFloat(localPrices[order.id]) === order.price) ? 0.5 : 1
                                                        }}
                                                    >
                                                        {updating === order.id ? "..." : "Add"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reference Image */}
                                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                                            <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Reference Photo</p>
                                            {order.referenceImagePath ? (
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <a href={`http://localhost:8080${order.referenceImagePath}`} target="_blank" rel="noreferrer">
                                                        <img
                                                            src={`http://localhost:8080${order.referenceImagePath}`}
                                                            alt="Reference"
                                                            style={{
                                                                width: 80, height: 80, objectFit: "cover",
                                                                borderRadius: 8, border: "1.5px solid var(--border)",
                                                                cursor: "pointer", transition: "opacity 0.15s",
                                                            }}
                                                            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")}
                                                            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                                                        />
                                                    </a>
                                                    <a
                                                        href={`http://localhost:8080${order.referenceImagePath}`}
                                                        target="_blank" rel="noreferrer"
                                                        style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}
                                                    >
                                                        <FaSearchPlus style={{ marginRight: 6 }} /> View Full Size ↗
                                                    </a>
                                                </div>
                                            ) : (
                                                <span style={{
                                                    fontSize: "0.78rem", color: "var(--muted)",
                                                    padding: "4px 10px", borderRadius: 20,
                                                    background: "rgba(150,150,150,0.12)",
                                                    display: "inline-block",
                                                }}>No image uploaded</span>
                                            )}
                                        </div>

                                        {order.deliveryAddress && (
                                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                                                <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Delivery Address</p>
                                                <p style={{ fontSize: "0.86rem" }}>{order.deliveryAddress}</p>
                                            </div>
                                        )}

                                        {order.notes && (
                                            <div style={{ marginTop: 8 }}>
                                                <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Notes</p>
                                                <p style={{ fontSize: "0.86rem", fontStyle: "italic", color: "var(--muted)" }}>{order.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </>
                )}

                {viewMode === "Chats" && (
                    <div style={{ display: "flex", flexDirection: "column", height: "70vh", minHeight: 500, background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
                        {!selectedUserChat ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.02)" }}>
                                <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={chatSearch}
                                        onChange={(e) => setChatSearch(e.target.value)}
                                        style={{
                                            width: "100%", padding: "10px 14px", borderRadius: 8,
                                            border: "1.5px solid var(--border)", background: "var(--bg)",
                                            color: "var(--text)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, overflowY: "auto" }}>
                                    {loading && chatUsers.length === 0 ? (
                                        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>Loading...</div>
                                    ) : (
                                        chatUsers
                                            .filter(u => u.name?.toLowerCase().includes(chatSearch.toLowerCase()) || u.email?.toLowerCase().includes(chatSearch.toLowerCase()))
                                            .map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedUserChat(user.id)}
                                                    style={{
                                                        padding: "16px",
                                                        borderBottom: "1px solid var(--border)",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        background: "transparent",
                                                        transition: "background 0.2s"
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                                                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>
                                                            {user.name}
                                                            {user.role === "ADMIN" && <span style={{ marginLeft: 6, fontSize: "0.7rem", background: "var(--gold)", color: "#000", padding: "2px 6px", borderRadius: 4 }}>ADMIN</span>}
                                                        </div>
                                                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                                                            {user.email} · ID: {user.id}
                                                        </div>
                                                    </div>
                                                    {unreadCounts[user.id] > 0 && (
                                                        <div style={{
                                                            background: "#e74c3c",
                                                            color: "#fff",
                                                            fontSize: "0.7rem",
                                                            fontWeight: 700,
                                                            borderRadius: 12,
                                                            padding: "2px 8px",
                                                            marginLeft: 8
                                                        }}>
                                                            {unreadCounts[user.id]}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                    )}
                                    {!loading && chatUsers.length === 0 && (
                                        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                                            No users with orders found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", minHeight: 0 }}>
                                <UserChat conversationUserId={selectedUserChat} isAdminView={true} onCloseAdmin={() => setSelectedUserChat(null)} />
                            </div>
                        )}
                    </div>
                )}

                {viewMode === "Feedbacks" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {feedbacks.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                                <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center" }}><FaEnvelope /></p>
                                <p style={{ marginTop: 12 }}>No messages from the Contact Us form yet.</p>
                            </div>
                        ) : (
                            feedbacks.map((fb) => (
                                <div key={fb.id} className="auth-card" style={{ padding: "20px 24px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                                        <div>
                                            <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                                                #{fb.id} · {formatDate(fb.submittedAt)}
                                            </p>
                                            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1rem", marginBottom: 2 }}>{fb.name}</h3>
                                            <a href={`mailto:${fb.email}`} style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 600 }}>{fb.email}</a>
                                        </div>
                                        <span style={{
                                            padding: "4px 14px", borderRadius: 30, fontSize: "0.78rem", fontWeight: 700,
                                            background: "rgba(231,76,60,0.1)", color: "#e74c3c"
                                        }}>
                                            {fb.subject || "No Subject"}
                                        </span>
                                    </div>
                                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                                        <p style={{ fontSize: "0.87rem", color: "var(--text)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{fb.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {viewMode === "Gallery" && (
                    <div>
                        <div className="auth-card" style={{ padding: "24px 28px", marginBottom: 24 }}>
                            <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 16 }}>Add New Image Request</h3>
                            <form onSubmit={handleAddGallery} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "end" }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Image URL</label>
                                    <input type="text" value={galleryForm.imageUrl} onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })} required placeholder="e.g. /images/portrait1.jpg" />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Category</label>
                                    <select value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                                        <option value="Single">Single</option>
                                        <option value="Couple">Couple</option>
                                        <option value="Family">Family</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Description (Optional)</label>
                                    <input type="text" value={galleryForm.description} onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })} placeholder="Short detail" />
                                </div>
                                <div style={{ gridColumn: "span 3" }}>
                                    <button type="submit" className="btn-primary" style={{ padding: "10px 24px", borderRadius: 8 }}>Add Image</button>
                                </div>
                            </form>
                        </div>

                        <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                            {gallery.map(img => (
                                <div key={img.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <img src={img.imageUrl.startsWith("http") ? img.imageUrl : `http://localhost:8080${img.imageUrl}`} alt={img.category} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found"; }} />
                                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{img.category}</span>
                                        </div>
                                        <button onClick={() => handleDeleteGallery(img.id)} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem" }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {gallery.length === 0 && <p style={{ color: "var(--muted)", gridColumn: "1/-1", textAlign: "center" }}>No images in the gallery yet.</p>}
                        </div>
                    </div>
                )}

                {viewMode === "Pricing" && (
                    <div>
                        <div className="auth-card" style={{ padding: "24px 28px", marginBottom: 24 }}>
                            <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 16 }}>Add Pricing Rule</h3>
                            <form onSubmit={handleAddPricing} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, alignItems: "end" }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Size</label>
                                    <input type="text" value={pricingForm.size} onChange={e => setPricingForm({ ...pricingForm, size: e.target.value })} required placeholder="A5, A4, A3..." />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Subject</label>
                                    <select value={pricingForm.type} onChange={e => setPricingForm({ ...pricingForm, type: e.target.value })}>
                                        <option value="Single">Single</option>
                                        <option value="Couple">Couple</option>
                                        <option value="Family">Family</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Color</label>
                                    <select value={pricingForm.colorType} onChange={e => setPricingForm({ ...pricingForm, colorType: e.target.value })}>
                                        <option value="Color">Color</option>
                                        <option value="BlackWhite">Black & White</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Price (₹)</label>
                                    <input type="number" value={pricingForm.price} onChange={e => setPricingForm({ ...pricingForm, price: e.target.value })} required placeholder="999" />
                                </div>
                                <div style={{ gridColumn: "span 4" }}>
                                    <button type="submit" className="btn-primary" style={{ padding: "10px 24px", borderRadius: 8 }}>Add Pricing Rule</button>
                                </div>
                            </form>
                        </div>

                        <div className="auth-card" style={{ padding: 0, overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ background: "rgba(0,0,0,0.03)", borderBottom: "1px solid var(--border)" }}>
                                        <th style={{ padding: "14px 20px", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase" }}>Size</th>
                                        <th style={{ padding: "14px 20px", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase" }}>Subject</th>
                                        <th style={{ padding: "14px 20px", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase" }}>Color</th>
                                        <th style={{ padding: "14px 20px", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase" }}>Price</th>
                                        <th style={{ padding: "14px 20px", fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing.map(p => (
                                        <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "14px 20px", fontWeight: 600 }}>{p.size}</td>
                                            <td style={{ padding: "14px 20px" }}>{p.type}</td>
                                            <td style={{ padding: "14px 20px" }}>{p.colorType === "BlackWhite" ? "Black & White" : p.colorType}</td>
                                            <td style={{ padding: "14px 20px", color: "var(--gold)", fontWeight: 700 }}>₹{p.price.toLocaleString("en-IN")}</td>
                                            <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                                <button onClick={() => handleDeletePricing(p.id)} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, padding: "6px 12px", cursor: "pointer", fontSize: "0.75rem" }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pricing.length === 0 && (
                                        <tr><td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>No pricing rules set.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 32, textAlign: "center" }}>
                    <Link to="/" style={{ color: "var(--muted)", fontSize: "0.85rem" }}>← Back to Site</Link>
                </div>
            </div>

            {/* Fixed Chat Widget for Admin */}
            {selectedUserChat && viewMode === "Orders" && (
                <div style={{
                    position: "fixed", bottom: 20, right: 20, width: 380, zIndex: 9999,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)"
                }}>
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setSelectedUserChat(null)}
                            style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text)", zIndex: 10 }}
                        >
                            ×
                        </button>
                        <UserChat conversationUserId={selectedUserChat} isAdminView={true} />
                    </div>
                </div>
            )}

            {/* Pulse animation for live indicator */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

            <Footer />
        </div>
    );
}

export default AdminPanel;
