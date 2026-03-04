import "../../App.css";
import { FaGift } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      {/* Announcement Band */}
      <div className="announcement-band">
        <FaGift className="inline-icon" /> <span>Free framing</span> on all orders above ₹2,000 · Use code{" "}
        <span>ARTLOVE</span>
      </div>

      <section className="hero">
        <div className="hero-content">
          {/* Left */}
          <div className="hero-left">
            <p className="hero-eyebrow">Premium Custom Art</p>
            <h1>
              Turn Memories into{" "}
              <em>Timeless</em> Masterpieces
            </h1>
            <p>
              We transform your cherished photos into stunning handcrafted
              portraits — painted with love, framed with precision, delivered
              to your door.
            </p>
            <div className="hero-buttons">
              <Link to="/gallery" className="btn-primary">Explore Gallery</Link>
              <Link to="/order" className="btn-outline">Place an Order</Link>
            </div>

            <div className="hero-stats">
              <div>
                <span className="stat-num">2,400+</span>
                <span className="stat-label">Artworks Delivered</span>
              </div>
              <div>
                <span className="stat-num">98%</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div>
                <span className="stat-num">12+</span>
                <span className="stat-label">Art Styles</span>
              </div>
            </div>
          </div>

          {/* Right – Framed Image */}
          <div className="hero-right">
            <div className="hero-frame-outer">
              <img
                src="https://i.pinimg.com/736x/15/bd/5e/15bd5e486b8711c761ed385eafa4948c.jpg"
                alt="Featured portrait artwork"
              />
              <div className="hero-badge">
                <div className="badge-icon">✦</div>
                <div className="badge-text">
                  <strong>Handcrafted</strong>
                  <span>By professional artists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;