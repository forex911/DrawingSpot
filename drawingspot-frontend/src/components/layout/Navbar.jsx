import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { IconBrush, IconCart } from "../common/Icons";
import { FaCommentDots } from "react-icons/fa";
import API from "../../api/axiosConfig";
import "../../App.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, userId, userRole, setIsChatOpen, isChatOpen } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    const fetchUnread = () => {
      API.get(`/chat/user/${userId}/unread-count?readerId=${userId}`)
        .then(res => setUnreadCount(res.data || 0))
        .catch(err => console.error("Failed to fetch unread count:", err));
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15s poll
    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/pricing", label: "Pricing" },
  ];

  if (isAuthenticated) {
    if (userRole === "ADMIN") {
      links.push({ to: "/admin", label: "Admin Panel" });
    }
    links.push({ to: "/dashboard", label: "Profile" });
    links.push({ to: "/my-orders", label: "My Orders" });
  } else {
    links.push({ to: "/login", label: "Login" });
  }

  const handleChatClick = (e) => {
    e.preventDefault();
    setIsChatOpen(!isChatOpen);
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">
          <IconBrush size={22} color="var(--gold)" />
        </span>
        Drawing<span>Spot</span>
      </Link>

      {/* Desktop Links */}
      <div className="navbar-links">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <Link to="/order" className="navbar-cta">Order Now</Link>
      </div>

      {/* Mobile row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {links.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
        <Link to="/order">Order Now</Link>
      </div>
    </nav>
  );
}

export default Navbar;