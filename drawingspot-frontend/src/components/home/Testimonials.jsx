import "../../App.css";
import { FaStar } from "react-icons/fa";

const REVIEWS = [
    {
        stars: 5,
        text: "I ordered a portrait of my parents for their anniversary. The quality was exceptional — every detail was captured perfectly. Will definitely order again!",
        name: "Priya M.",
        location: "Mumbai",
        initials: "PM",
    },
    {
        stars: 5,
        text: "The packaging was gorgeous and the painting arrived in perfect condition. The boho-style piece looks stunning above our fireplace. Highly recommend!",
        name: "Arjun K.",
        location: "Bangalore",
        initials: "AK",
    },
    {
        stars: 5,
        text: "I was skeptical about ordering art online but DrawingSpot exceeded all expectations. The line art portrait is exactly what I imagined, absolutely beautiful.",
        name: "Sneha R.",
        location: "Delhi",
        initials: "SR",
    },
];

function Testimonials() {
    return (
        <section className="testimonials-section">
            <p className="section-tag">Customer Love</p>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-sub">
                Real stories from customers who turned their memories into art.
            </p>
            <div className="testimonials-track">
                {REVIEWS.map((r) => (
                    <div className="testimonial-card" key={r.name}>
                        <div className="testimonial-stars">
                            {Array.from({ length: r.stars }).map((_, i) => (
                                <FaStar key={i} />
                            ))}
                        </div>
                        <p className="testimonial-text">"{r.text}"</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">{r.initials}</div>
                            <div className="testimonial-author-info">
                                <strong>{r.name}</strong>
                                <span>{r.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Testimonials;
