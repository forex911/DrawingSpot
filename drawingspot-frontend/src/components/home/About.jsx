import "../../App.css";
import { IconUpload, IconPalette, IconPencil, IconPackage } from "../common/Icons";

const STEPS = [
  {
    number: "01",
    icon: <IconUpload size={28} color="var(--gold)" />,
    title: "Upload Your Photo",
    desc: "Share a clear, well-lit reference photo. We work from any resolution.",
  },
  {
    number: "02",
    icon: <IconPalette size={28} color="var(--gold)" />,
    title: "Choose Your Style",
    desc: "Pick Black & White pencil or Colour portrait, and your preferred canvas size.",
  },
  {
    number: "03",
    icon: <IconPencil size={28} color="var(--gold)" />,
    title: "We Hand-Draw It",
    desc: "Our professional artists create your piece with care and precision — every stroke by hand.",
  },
  {
    number: "04",
    icon: <IconPackage size={28} color="var(--gold)" />,
    title: "Delivered to You",
    desc: "Beautifully framed and securely packed, shipped free to your doorstep across India.",
  },
];

function About() {
  return (
    <section className="about-section">
      <p className="section-tag">How It Works</p>
      <h2 className="section-title">From Photo to Masterpiece</h2>
      <p className="section-sub">A simple 4-step process to get your custom portrait delivered at home.</p>
      <div className="about-grid">
        {STEPS.map((step) => (
          <div className="about-step" key={step.number}>
            <div className="step-number">{step.number}</div>
            <div className="step-icon-wrap">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;