import "../App.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const SECTIONS = [
    {
        title: "Choosing Your Art Medium",
        items: [
            "Charcoal: Perfect for dramatic, high-contrast portraits with deep shadows.",
            "Graphite (Pencil): Ideal for detailed, subtle, and realistic drawings.",
            "Color Pencil: Brings vibrant and lifelike colors to your cherished memories."
        ],
    },
    {
        title: "Selecting the Right Photo",
        items: [
            "Use high-resolution photos with good lighting for the best results.",
            "Ensure the subject's features are clearly visible without heavy filters.",
            "Avoid blurry or pixelated images as they make detailing difficult.",
            "You can upload multiple photos if you want to combine subjects."
        ],
    },
    {
        title: "Understanding Sizes",
        items: [
            "A5 Size (5.8 x 8.3 in): Perfect for small, intimate portraits and desk displays.",
            "A4 Size (8.3 x 11.7 in): Best for single portraits and small spaces.",
            "A3 Size (11.7 x 16.5 in): Ideal for couple portraits and living rooms.",
            "A2 Size (16.5 x 23.4 in): Perfect for family portraits and making a grand statement.",
            "Note: A2 → A3 → A4 → A5. Each size is half of the previous size."
        ],
    },
    {
        title: "Framing Options",
        items: [
            "Unframed: Comes rolled in a secure tube. Best if you want to choose your own frame.",
            "Standard Black/White Frame: A classic choice that suits most interiors.",
            "Premium Wood Frame: Adds an elegant, rustic touch to your artwork."
        ],
    },
    {
        title: "The Order Process",
        items: [
            "Select your medium, size, and framing preferences on the order page.",
            "Upload your reference photo(s) and add any specific instructions.",
            "Complete the checkout process.",
            "We'll review your order and start the artistic process."
        ],
    },
];

function ArtBuyingGuide() {
    return (
        <div className="support-page">
            <Navbar />

            <div className="support-hero">
                <p className="section-tag">Guide to Commissioning Art</p>
                <h1>Art Buying Guide</h1>
                <p>Everything you need to know about commissioning the perfect handcrafted portrait.</p>
            </div>

            <div className="support-content">
                {SECTIONS.map((sec) => (
                    <div className="shipping-section" key={sec.title}>
                        <h3 className="shipping-section-title">{sec.title}</h3>
                        <ul className="shipping-list">
                            {sec.items.map((item, i) => (
                                <li key={i}>
                                    <span className="shipping-dot" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {sec.title === "Understanding Sizes" && (
                            <div className="paper-size-visualizer-container">
                                <img
                                    src="https://res.cloudinary.com/di2whkw7l/image/upload/size_diff_ed2qju.png"
                                    alt="Paper Size Comparison"
                                    className="paper-size-img"
                                />
                            </div>
                        )}
                    </div>
                ))}

                <div className="support-cta-box" style={{ marginTop: 48 }}>
                    <h2>Ready to get your portrait?</h2>
                    <p>Head over to our order page and start your journey.</p>
                    <a href="/order" className="btn-primary">Place Order →</a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ArtBuyingGuide;
