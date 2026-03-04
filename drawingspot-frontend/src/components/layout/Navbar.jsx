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
  const { isAuthenticated, userId, setIsChatOpen, isChatOpen } = useAuth();
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
    isAuthenticated ? { to: "/dashboard", label: "Profile" } : { to: "/login", label: "Login" },
  ];

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

        {/* Chat */}
        {isAuthenticated && (
          <button className="navbar-cart-btn" onClick={handleChatClick} aria-label="Chat with support" style={{ position: "relative" }}>
            <FaCommentDots size={20} />
            {unreadCount > 0 && (
              <span className="cart-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>
        )}

        {/* Cart */}
        <button className="navbar-cart-btn" onClick={() => setIsOpen(true)} aria-label={`Cart (${totalItems})`}>
          <IconCart size={20} />
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>
          )}
        </button>
      </div>

      {/* Mobile row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isAuthenticated && (
          <button className="navbar-cart-btn mobile-cart" onClick={handleChatClick} aria-label="Chat" style={{ position: "relative" }}>
            <FaCommentDots size={20} />
            {unreadCount > 0 && <span className="cart-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
        )}
        <button className="navbar-cart-btn mobile-cart" onClick={() => setIsOpen(true)} aria-label="Cart">
          <IconCart size={20} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
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