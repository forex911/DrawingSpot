import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { IconHeart, IconCart } from "../common/Icons";
import "../../App.css";
const imageModules = import.meta.glob(
    "../../assets/images/**/*.{jpg,jpeg,png,webp}",
    { eager: true, import: "default" }
);

const getImage = (fileName) =>
    imageModules[`../../assets/images/${fileName}`];
const SECTIONS = [
    {

        title: "Black & White",
        sub: "Classic pencil & graphite portraits — timeless and detailed.",
        items: [
            { id: 1, title: "Graphite Single Portrait", artist: "DrawingSpot Artist", price: "₹2,500", originalPrice: "₹2,800", badge: "A4", img: "https://i.pinimg.com/736x/b3/86/ce/b386ce9b6485e6878bc0223d6d5f42ab.jpg" },
            { id: 2, title: "Pencil Couple Portrait", artist: "DrawingSpot Artist", price: "₹4,000", originalPrice: "₹4,500", badge: "A4", img: getImage("A4/a4-couple.jpeg") },
            { id: 3, title: "A3 Portrait", artist: "DrawingSpot Artist", price: "₹8,000", originalPrice: "₹10,000", badge: "A3", img: getImage("A3/a3-single.jpg") },
            { id: 4, title: "A5 Graphite Sketch", artist: "DrawingSpot Artist", price: "₹1,200", originalPrice: "₹1,400", badge: "A5", img: "https://i.pinimg.com/736x/25/0f/df/250fdfd6cc479645a4cf1029c76650c2.jpg" },
            // { id: 5, title: "A2 Detailed Portrait", artist: "DrawingSpot Artist", price: "₹9,000", originalPrice: "₹11,000", badge: "A2", img: "https://i.pinimg.com/736x/f1/20/73/f120731c4711224507bb5524b9f3d379.jpg" },
            { id: 6, title: "A2 Family B&W Portrait", artist: "DrawingSpot Artist", price: "₹15,000", originalPrice: "₹18,000", badge: "A2", img: getImage("A3/a3-couple3.jpeg") },
            { id: 7, title: "A3 Couple Portrait", artist: "DrawingSpot Artist", price: "₹8,000", originalPrice: "₹10,000", badge: "A3", img: getImage("A3/a3-couple.jpeg") }
        ],
    },
    {
        title: "Colour Portraits",
        sub: "Rich layered colour with premium materials — more depth, more life.",
        items: [
            { id: 7, title: "Colour Single Portrait", artist: "DrawingSpot Artist", price: "₹3,000", originalPrice: "₹3,500", badge: "A4", img: getImage("A4/a4-single (3).jpeg") },
            { id: 8, title: "A4 Realistic Artwork", artist: "DrawingSpot Artist", price: "₹4,500", originalPrice: "₹5,500", badge: "A4", img: getImage("A4/a4-color.jpeg") },
            { id: 9, title: "A3 Colour Family Portrait", artist: "DrawingSpot Artist", price: "₹9,000", originalPrice: "₹12,000", badge: "A3", img: "https://i.pinimg.com/736x/a5/78/03/a57803e6f37f73382bf89b007a4b5954.jpg" },
            { id: 10, title: "A5 Colour Portrait", artist: "DrawingSpot Artist", price: "₹1,500", originalPrice: "₹1,800", badge: "A5", img: getImage("A5/a5-custom.jpeg") },
            { id: 11, title: "A2 Premium Colour Portrait", artist: "DrawingSpot Artist", price: "₹11,000", originalPrice: "₹13,000", badge: "A2", img: getImage("A3/a3-couple (2).jpeg") },
            { id: 12, title: "A1 Grand Family Portrait", artist: "DrawingSpot Artist", price: "₹22,000", originalPrice: "₹28,000", badge: "A1", img: "https://i.pinimg.com/736x/a5/78/03/a57803e6f37f73382bf89b007a4b5954.jpg" },
        ],
    },
];

function ArtCard({ item }) {
    const [wished, setWished] = useState(false);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div className="art-card">
            <div className="art-card-img">
                <img src={item.img} alt={item.title} loading="lazy" draggable="false" />
                <span className="art-discount-badge">{item.badge}</span>
                <button
                    className={`art-heart-btn${wished ? " wished" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
                    aria-label="Wishlist"
                >
                    <IconHeart size={15} filled={wished} />
                </button>
            </div>
            <div className="art-card-info">
                <h4>{item.title}</h4>
                <p className="artist-name">{item.artist}</p>
                <div className="art-price-row">
                    <span className="art-price-label">From</span>
                    <span className="art-price">{item.price}</span>
                    <span className="art-original-price">{item.originalPrice}</span>
                </div>
                {/* Cart feature temporarily disabled
                <button className={`art-add-to-cart-btn${added ? " added" : ""}`} onClick={handleAdd}>
                    {added ? "Added" : <><IconCart size={13} /> Add to Cart</>}
                </button>
                */}
            </div>
        </div>
    );
}

function ScrollCarousel({ sectionData }) {
    const trackRef = useRef(null);

    // ── Mouse drag to scroll ──────────────────────────────────
    const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

    const onMouseDown = (e) => {
        drag.current = { active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft };
        trackRef.current.style.cursor = "grabbing";
    };

    const onMouseUp = () => {
        drag.current.active = false;
        trackRef.current.style.cursor = "grab";
    };

    const onMouseMove = (e) => {
        if (!drag.current.active) return;
        e.preventDefault();
        const x = e.pageX - trackRef.current.offsetLeft;
        const walk = (x - drag.current.startX) * 1.2;
        trackRef.current.scrollLeft = drag.current.scrollLeft - walk;
    };

    // ── Arrow scroll ─────────────────────────────────────────
    const scrollBy = (dir) => {
        trackRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
    };

    return (
        <div className="carousel-section">
            <div className="sc-header">
                <div className="sc-header-text">
                    <h2 className="carousel-section-title">{sectionData.title}</h2>
                    <p className="inf-carousel-sub">{sectionData.sub}</p>
                </div>
                <div className="sc-header-controls">
                    <button className="sc-arrow" onClick={() => scrollBy(-1)} aria-label="Scroll left">←</button>
                    <button className="sc-arrow" onClick={() => scrollBy(1)} aria-label="Scroll right">→</button>
                    <Link to="/gallery" className="inf-view-all-btn">View All →</Link>
                </div>
            </div>

            <div className="sc-window">
                <div className="inf-fade-left" />
                <div className="inf-fade-right" />

                <div
                    className="sc-track"
                    ref={trackRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                >
                    {sectionData.items.map((item) => (
                        <div className="sc-card-wrap" key={item.id}>
                            <ArtCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeaturedCarousels() {
    return (
        <>
            {SECTIONS.map((s) => <ScrollCarousel key={s.title} sectionData={s} />)}
        </>
    );
}

export default FeaturedCarousels;
