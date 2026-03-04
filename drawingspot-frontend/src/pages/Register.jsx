import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";

// Google "G" logo SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess(true);
    } catch {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      try {
        // 1. Fetch the user's Google profile (token already verified by Google)
        const profileRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const { name, email, sub } = profileRes.data;

        // 2. Single call: backend finds existing user OR creates a new one.
        //    This fixes the old bug where the register-then-login dance would fail
        //    for users who already had an email/password account with this email.
        const loginRes = await API.post("/auth/google-login", { name, email, googleId: sub });
        login(loginRes.data);
        navigate("/dashboard");
      } catch {
        setError("Google sign-up failed. Please try again.");
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19.5c0 1.38-1.12 2.5-2.5 2.5S7 20.88 7 19.5c0-.87.5-1.5 1-2l3.5-3.5 1 4z" />
              <path d="M18.37 3.63a2.12 2.12 0 0 1 3 3L9 19l-4 1 1-4L18.37 3.63z" />
            </svg>
          </div>
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-sub">Join DrawingSpot and start your art journey.</p>

          {/* Google button */}
          <button className="google-signin-btn" onClick={() => handleGoogle()} type="button">
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {success ? (
            <div className="order-success" style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <FaCheckCircle style={{ fontSize: "3rem", color: "var(--success)" }} />
              </div>
              <h3 style={{ marginBottom: 10, fontFamily: "var(--font-head)" }}>Account Created!</h3>
              <p>You're all set. Sign in to start ordering.</p>
              <Link to="/login" className="btn-primary" style={{ display: "inline-block", marginTop: 20 }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Your mobile number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Choose a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", padding: "13px", borderRadius: "8px", fontSize: "1rem" }}
                disabled={loading}
              >
                {loading ? "Creating Account…" : "Create My Account →"}
              </button>
            </form>
          )}

          {!success && (
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;