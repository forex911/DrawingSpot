import "../../App.css";
import { IconPencil, IconPalette, IconPerson, IconCouple, IconFamily } from "../common/Icons";

function CategoryGrid() {
    return (
        <section className="category-section">
            <div className="section-header">
                <p className="section-tag">Browse by Style</p>
                <h2 className="section-title">Portrait Categories</h2>
                <p className="section-sub">Every portrait handcrafted to perfection — choose your style and size.</p>
            </div>

            <div className="portrait-cat-grid">
                {/* ── Black & White ── */}
                <div className="portrait-cat-card bw-card">
                    {/* decorative lines */}
                    <div className="cat-deco-lines">
                        <span /><span /><span />
                    </div>

                    <div className="portrait-cat-body">
                        <div className="cat-icon-ring bw-ring">
                            <IconPencil size={28} color="#fff" />
                        </div>

                        <h3 className="cat-title">Black &amp; White</h3>
                        <p className="cat-desc">Pencil &amp; graphite portraits — timeless, detailed, elegant.</p>

                        <div className="cat-sizes-bar">
                            {["A5", "A4", "A3", "A2", "A1"].map((s) => (
                                <div key={s} className="cat-size-cell">
                                    <span className="cat-size-label">{s}</span>
                                </div>
                            ))}
                        </div>

                        <div className="cat-divider" />

                        <p className="cat-from">Starting from</p>
                        <p className="cat-price">₹1,200</p>
                    </div>
                </div>

                {/* ── Colour Portrait ── */}
                <div className="portrait-cat-card color-card">
                    <div className="cat-deco-lines">
                        <span /><span /><span />
                    </div>

                    <div className="portrait-cat-body">
                        <div className="cat-icon-ring color-ring">
                            <IconPalette size={28} color="#1c1c1c" />
                        </div>

                        <h3 className="cat-title">Colour Portrait</h3>
                        <p className="cat-desc">Rich layered colour with premium materials — more depth, more life.</p>

                        <div className="cat-sizes-bar">
                            {["A5", "A4", "A3", "A2", "A1"].map((s) => (
                                <div key={s} className="cat-size-cell">
                                    <span className="cat-size-label gold-label">{s}</span>
                                </div>
                            ))}
                        </div>

                        <div className="cat-divider gold-divider" />

                        <p className="cat-from">Starting from</p>
                        <p className="cat-price gold-price">₹1,500</p>
                    </div>
                </div>
            </div>

            {/* Subject row */}
            <div className="subject-row">
                {[
                    { icon: <IconPerson size={18} color="var(--gold)" />, label: "Single Portrait" },
                    { icon: <IconCouple size={18} color="var(--gold)" />, label: "Couple Portrait" },
                    { icon: <IconFamily size={18} color="var(--gold)" />, label: "Family Portrait (3–4)" },
                ].map((s) => (
                    <div className="subject-chip" key={s.label}>
                        <span className="subject-chip-icon">{s.icon}</span>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategoryGrid;
