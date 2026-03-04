import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

import { FaMailBulk, FaPencilAlt, FaCheckCircle, FaHourglassHalf, FaPalette, FaHeart, FaSmile, FaLock } from "react-icons/fa";
import "../App.css";

const STATUS_COLORS = {
  Received: { bg: "rgba(212, 175, 55, 0.15)", color: "var(--gold)", label: <><FaMailBulk style={{ display: "inline-block", marginRight: 4 }} /> Received</> },
  Sketching: { bg: "rgba(100, 149, 237, 0.15)", color: "#6495ED", label: <><FaPencilAlt style={{ display: "inline-block", marginRight: 4 }} /> Sketching</> },
  Delivered: { bg: "rgba(50, 205, 50, 0.15)", color: "#50C878", label: <><FaCheckCircle style={{ display: "inline-block", marginRight: 4 }} /> Delivered</> },
};

function StatusBadge({ status }) {
  const cfg = STATUS_COLORS[status] || { bg: "rgba(200,200,200,0.15)", color: "var(--muted)", label: status };
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 30,
      fontSize: "0.78rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: cfg.bg,
      color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Dashboard() {
  const { isAuthenticated, userId, userName, isGoogleUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);
    setPasswordError("");
    try {
      const res = await API.put("/auth/set-password", {
        userId: userId,
        newPassword: passwordForm.newPassword
      });
      login(res.data); // this will update context and set isGoogleUser to false
      setPasswordSuccess("Password set successfully! You can now log in using your email.");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || "Failed to set password. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/dashboard");
      return;
    }
    const endpoint = userId ? `/orders/user/${userId}` : "/orders";
    API.get(endpoint)
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load orders. Please try again later."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId, navigate]);

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-page-header">
        <p className="section-tag">My Account</p>
        <h1>My Orders</h1>
        <p style={{ color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          {userName ? <>Welcome back, {userName} <FaSmile style={{ color: "var(--gold)" }} /></> : "Here are all your portrait commissions."}
        </p>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 5%" }}>

        {isGoogleUser && (
          <div className="auth-card" style={{ padding: "32px", marginBottom: "40px", border: "2px solid var(--gold)" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", marginBottom: 10, display: "flex", alignItems: "center" }}>
              <FaLock style={{ color: "var(--gold)", marginRight: 10 }} /> Enable Email Login
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
              You signed in using Google. Set a password now so you can also log in using your email ({userName}'s email) and password anytime.
            </p>

            {passwordError && <div className="auth-error" style={{ marginBottom: 16 }}>{passwordError}</div>}
            {passwordSuccess ? (
              <div style={{ background: "rgba(50,205,50,0.1)", color: "#2E8B57", padding: "16px", borderRadius: 8, fontWeight: 600 }}>
                {passwordSuccess}
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} style={{ display: "grid", gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>New Password</label>
                  <input type="password" required placeholder="Minimum 6 characters"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Confirm Password</label>
                  <input type="password" required placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={passwordSaving} style={{ marginTop: 8, padding: "12px", borderRadius: 8 }}>
                  {passwordSaving ? "Saving…" : "Set Password →"}
                </button>
              </form>
            )}
          </div>
        )}

        <div>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: "1.5rem", display: "flex", justifyContent: "center" }}><FaHourglassHalf /></p>
              <p>Loading your orders…</p>
            </div>
          )}

          {error && (
            <div className="auth-error" style={{ marginBottom: 24 }}>{error}</div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="auth-card" style={{ textAlign: "center", padding: "52px 40px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16, display: "flex", justifyContent: "center" }}><FaPalette /></div>
              <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 10 }}>No orders yet</h2>
              <p style={{ color: "var(--muted)", marginBottom: 28 }}>
                You haven't placed any portrait commissions yet. Start by choosing a style!
              </p>
              <Link to="/order" className="btn-primary" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 8 }}>
                Place Your First Order →
              </Link>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {orders.map((order) => (
                <div key={order.id} className="auth-card" style={{ padding: "24px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Order #{order.id}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", marginBottom: 0 }}>
                        {order.colorType === "BlackWhite" ? <><FaHeart style={{ display: "inline-block", marginRight: 4 }} /> Black & White</> : <><FaPalette style={{ display: "inline-block", marginRight: 4 }} /> Colour</>} Portrait · {order.size}
                      </h3>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px 24px" }}>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</p>
                      <p style={{ fontSize: "0.92rem", fontWeight: 600 }}>{order.type || "—"}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Size</p>
                      <p style={{ fontSize: "0.92rem", fontWeight: 600 }}>{order.size || "—"}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</p>
                      <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--gold)" }}>
                        {order.price ? `₹${Number(order.price).toLocaleString("en-IN")}` : "To be confirmed"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Placed On</p>
                      <p style={{ fontSize: "0.92rem", fontWeight: 600 }}>{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Delivery Address</p>
                      <p style={{ fontSize: "0.88rem" }}>{order.deliveryAddress}</p>
                    </div>
                  )}

                  {order.notes && (
                    <div style={{ marginTop: 10 }}>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</p>
                      <p style={{ fontSize: "0.88rem", fontStyle: "italic", color: "var(--muted)" }}>{order.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/order" className="btn-primary" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 8, marginBottom: 16 }}>
              Place Another Order →
            </Link>
            <br />
            <button
              onClick={() => { logout(); navigate("/"); }}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.88rem", cursor: "pointer", textDecoration: "underline", marginTop: 8 }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;