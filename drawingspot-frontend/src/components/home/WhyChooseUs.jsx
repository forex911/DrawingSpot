import "../../App.css";
import { IconBrush, IconFrame, IconClock, IconShield } from "../common/Icons";

const BADGES = [
  {
    icon: <IconBrush size={26} color="#fff" />,
    title: "100% Handcrafted",
    desc: "Each piece is drawn by our professional artists — no digital prints, ever.",
  },
  {
    icon: <IconFrame size={26} color="#fff" />,
    title: "Premium Framing",
    desc: "Delivered in a beautiful premium-quality frame, ready to hang on your wall.",
  },
  {
    icon: <IconClock size={26} color="#fff" />,
    title: "Fast Turnaround",
    desc: "Most orders completed and shipped within 5–15 business days.",
  },
  {
    icon: <IconShield size={26} color="#fff" />,
    title: "Satisfaction Guarantee",
    desc: "Not happy? We'll redo it until you love it — free revisions, no questions asked.",
  },
];

function WhyChooseUs() {
  return (
    <section className="trust-section">
      <div className="trust-grid">
        {BADGES.map((b) => (
          <div className="trust-item" key={b.title}>
            <div className="trust-icon-wrap">{b.icon}</div>
            <div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;