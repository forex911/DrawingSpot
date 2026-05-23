import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaMapMarkerAlt, FaSmile, FaImage } from "react-icons/fa";
import imageCompression from 'browser-image-compression';
import "../App.css";

function Dashboard() {
  const { isAuthenticated, userId, userName, isGoogleUser, login, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState("");
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: ""
  });

  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/dashboard");
      return;
    }
    // Fetch profile data
    API.get(`/auth/${userId}`)
      .then((res) => {
        const data = res.data;
        setProfileForm({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          profilePicture: data.profilePicture || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          pincode: data.pincode || "",
          address: data.address || ""
        });
      })
      .catch((err) => console.error("Error loading profile", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, userId, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage({ text: "", type: "" });
    try {
      const res = await API.put("/auth/profile", {
        id: userId,
        ...profileForm
      });
      // Optionally update AuthContext if userName changes
      if (res.data.name !== userName) {
         // This is a simplified context update, realistically you might re-login or update context
      }
      setProfileMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setProfileMessage({ text: "Failed to update profile. Please try again.", type: "error" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    setUploadProgress(0);
    setUploadPhase("Preparing...");
    setProfileMessage({ text: "", type: "" });

    let finalFile = file;
    if (file.size > 10 * 1024 * 1024) {
      try {
        setUploadPhase("Compressing...");
        const options = { 
          maxSizeMB: 9.5, 
          maxWidthOrHeight: 4096, 
          useWebWorker: true,
          onProgress: (p) => setUploadProgress(p)
        };
        const compressedBlob = await imageCompression(file, options);
        finalFile = new File([compressedBlob], file.name, { type: compressedBlob.type || file.type });
      } catch (error) {
        console.error("Compression error:", error);
        setProfileMessage({ text: "Failed to compress image.", type: "error" });
        setAvatarUploading(false);
        return;
      }
    }

    if (finalFile.size > 10 * 1024 * 1024) {
      setProfileMessage({ text: "Image exceeds Cloudinary's 10 MB limit. Please use a smaller image.", type: "error" });
      setAvatarUploading(false);
      return;
    }

    setUploadPhase("Uploading...");
    setUploadProgress(0);
    try {
      // Direct upload to Cloudinary
      const fd = new FormData();
      fd.append("file", finalFile);
      fd.append("upload_preset", "DRAWINGSOPT");

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/dfnzagl9p/image/upload`,
        fd,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        }
      );
      
      const imageUrl = cloudinaryRes.data.secure_url;
      
      // Update profile with the new URL
      const res = await API.put("/auth/profile", {
        id: userId,
        profilePicture: imageUrl
      });
      setProfileForm(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      setProfileMessage({ text: "Profile picture uploaded successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setProfileMessage({ text: err.response?.data?.error || "Failed to upload profile picture.", type: "error" });
    } finally {
      setAvatarUploading(false);
      setUploadPhase("");
      setUploadProgress(0);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage({ text: "", type: "" });
    try {
      const res = await API.put("/auth/set-password", {
        userId: userId,
        newPassword: passwordForm.newPassword
      });
      login(res.data); // updates context (isGoogleUser -> false)
      setPasswordMessage({ text: "Password set successfully! You can now log in using your email.", type: "success" });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setPasswordMessage({ text: err.response?.data?.message || "Failed to set password.", type: "error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-page-header">
        <p className="section-tag">Account Settings</p>
        <h1>My Profile</h1>
        <p style={{ color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          {userName ? <>Welcome back, {userName} <FaSmile style={{ color: "var(--gold)" }} /></> : "Manage your personal information and preferences."}
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 5%" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
            Loading your profile…
          </div>
        ) : (
          <>
            <style>{`
              .profile-layout { display: grid; gap: 32px; grid-template-columns: 1fr; align-items: start; }
              @media (min-width: 900px) { .profile-layout { grid-template-columns: 2fr 1.1fr; } }
            `}</style>
            <div className="profile-layout">

            {/* Profile Information */}
            <div className="auth-card" style={{ padding: "32px", maxWidth: "100%" }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", marginBottom: 24, display: "flex", alignItems: "center" }}>
                <FaUser style={{ color: "var(--gold)", marginRight: 10 }} /> Basic Information
              </h2>

              {profileMessage.text && (
                <div style={{
                  background: profileMessage.type === "success" ? "rgba(50,205,50,0.1)" : "rgba(255,69,58,0.1)",
                  color: profileMessage.type === "success" ? "#2E8B57" : "#FF453A",
                  padding: "12px 16px", borderRadius: 8, fontWeight: 600, marginBottom: 20
                }}>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                
                {/* Avatar Preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", background: "var(--card-hover)",
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                    border: "2px solid var(--border)"
                  }}>
                    {profileForm.profilePicture ? (
                      <img src={profileForm.profilePicture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <FaUser size={28} color="var(--muted)" />
                    )}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <label><FaImage style={{ marginRight: 6 }} /> Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={avatarUploading} />
                    {avatarUploading && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>
                          <span>{uploadPhase}</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${uploadProgress}%`, height: "100%", background: "var(--gold)", transition: "width 0.2s" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name</label>
                    <input type="text" required
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Username</label>
                    <input type="text" placeholder="e.g. johndoe99"
                      value={profileForm.username}
                      onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Email Address</label>
                    <input type="email" disabled value={profileForm.email} style={{ background: "rgba(0,0,0,0.03)", color: "var(--muted)" }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Phone Number</label>
                    <input type="tel"
                      value={profileForm.phoneNumber}
                      onChange={e => setProfileForm({ ...profileForm, phoneNumber: e.target.value })} />
                  </div>
                </div>

                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", marginTop: 12, marginBottom: 4, display: "flex", alignItems: "center" }}>
                  <FaMapMarkerAlt style={{ color: "var(--gold)", marginRight: 8 }} /> Address Information
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Country</label>
                    <input type="text"
                      value={profileForm.country}
                      onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>State / Province</label>
                    <input type="text"
                      value={profileForm.state}
                      onChange={e => setProfileForm({ ...profileForm, state: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>City</label>
                    <input type="text"
                      value={profileForm.city}
                      onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Pincode / Zip Code</label>
                    <input type="text"
                      value={profileForm.pincode}
                      onChange={e => setProfileForm({ ...profileForm, pincode: e.target.value })} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Address</label>
                  <textarea rows="3" placeholder="Street address, apartment, suite, etc."
                    value={profileForm.address}
                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
                </div>

                <button type="submit" className="btn-primary" disabled={profileSaving} style={{ marginTop: 8, padding: "12px", borderRadius: 8 }}>
                  {profileSaving ? "Saving Changes…" : "Update Profile"}
                </button>
              </form>
            </div>

            {/* Account Information (Password) */}
            <div className="auth-card" style={{ padding: "32px", maxWidth: "100%", border: isGoogleUser ? "2px solid var(--gold)" : "1px solid var(--border)" }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", marginBottom: 10, display: "flex", alignItems: "center" }}>
                <FaLock style={{ color: "var(--gold)", marginRight: 10 }} /> Account Security
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
                {isGoogleUser 
                  ? "You signed in using Google. Set a password now so you can also log in using your email and password anytime." 
                  : "Update your password here to keep your account secure."}
              </p>

              {passwordMessage.text && (
                <div style={{
                  background: passwordMessage.type === "success" ? "rgba(50,205,50,0.1)" : "rgba(255,69,58,0.1)",
                  color: passwordMessage.type === "success" ? "#2E8B57" : "#FF453A",
                  padding: "12px 16px", borderRadius: 8, fontWeight: 600, marginBottom: 20
                }}>
                  {passwordMessage.text}
                </div>
              )}

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
                  {passwordSaving ? "Saving…" : "Set Password"}
                </button>
              </form>
            </div>

            <div style={{ textAlign: "center", marginTop: 12, gridColumn: "1 / -1" }}>
              <button
                onClick={() => { logout(); navigate("/"); }}
                style={{ background: "none", border: "none", color: "var(--error)", fontSize: "0.9rem", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
              >
                Sign Out
              </button>
            </div>
          </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;