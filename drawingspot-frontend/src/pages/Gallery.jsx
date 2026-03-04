import { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { FaHeart, FaPalette, FaCheck, FaHourglassHalf } from "react-icons/fa";

const CATEGORIES = ["All", "Single", "Couple", "Family"];

function GalleryCard({ art }) {
  return (
    <div className="gallery-item">
      <img
        src={art.imageUrl.startsWith("http") ? art.imageUrl : `http://localhost:8080${art.imageUrl}`}
        alt={art.category}
        loading="lazy"
        onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Image+Not+Found"; }}
      />
      <div className="gallery-item-overlay">
        <span className="gallery-cat-tag">
          {art.category === "Single" ? <FaHeart style={{ display: "inline-block", marginRight: 4 }} /> : <FaPalette style={{ display: "inline-block", marginRight: 4 }} />}
          {art.category} Portrait
        </span>
        {art.description && <p className="gallery-item-title" style={{ marginTop: 8 }}>{art.description}</p>}
      </div>
    </div>
  );
}



function Gallery() {
  const [activeCat, setActiveCat] = useState("All");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/gallery")
      .then(res => {
        let data = Array.isArray(res.data) ? res.data : [];
        data = data.sort(() => Math.random() - 0.5); // Shuffle array
        setArtworks(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = artworks.filter((a) => {
    return activeCat === "All" || a.category === activeCat;
  });

  return (
    <div className="gallery-page">
      <Navbar />

      <div className="gallery-page-header">
        <p className="section-tag">Our Portfolio</p>
        <h1>Portrait Gallery</h1>
        <p>Handcrafted Black &amp; White and Colour portraits — every piece made to order.</p>
      </div>

      {/* Category filter */}
      <div className="gallery-filters">
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`filter-btn${activeCat === cat ? " active" : ""}`} onClick={() => setActiveCat(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center" }}><FaHourglassHalf /></p>
          <p>Loading gallery images…</p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div style={{ padding: "0 4% 16px", color: "var(--muted)", fontSize: "0.85rem", textAlign: "center" }}>
            Showing {filtered.length} portrait{filtered.length !== 1 ? "s" : ""}
            {activeCat !== "All" ? ` in ${activeCat}` : ""}
          </div>

          {/* Grid */}
          <div className="gallery-container">
            <div className="gallery-masonry">
              {filtered.length > 0 ? filtered.map((art) => (
                <GalleryCard key={art.id} art={art} />
              )) : (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                  <p style={{ fontSize: "2rem", display: "flex", justifyContent: "center", marginBottom: "1rem" }}><FaPalette /></p>
                  <p>No portraits match this category.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "48px 4%" }}>
        <h2 style={{ fontFamily: "var(--font-head)", marginBottom: 12 }}>Want a portrait like these?</h2>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>Upload your reference photo and we'll hand-draw your portrait.</p>
        <Link to="/order"><button className="btn-primary" style={{ padding: "13px 36px", borderRadius: 8 }}>Commission Your Portrait →</button></Link>
      </div>

      <Footer />
    </div>
  );
}

export default Gallery;