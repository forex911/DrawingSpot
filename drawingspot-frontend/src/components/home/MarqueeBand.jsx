import "../../App.css";
import { IconShield, IconPackage, IconTruck, IconFrame, IconRefresh } from "../common/Icons";

const ITEMS = [
    { icon: <IconShield size={16} />, text: "SECURE PAYMENT" },
    { icon: <IconPackage size={16} />, text: "COD AVAILABLE" },
    { icon: <IconTruck size={16} />, text: "FREE SHIPPING IN INDIA" },
    { icon: <IconBrushInline />, text: "HANDCRAFTED PORTRAITS" },
    { icon: <IconRefresh size={16} />, text: "FREE REVISIONS" },
    { icon: <IconFrame size={16} />, text: "PREMIUM FRAMING" },
];

function IconBrushInline() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19.5c0 1.38-1.12 2.5-2.5 2.5S7 20.88 7 19.5c0-.87.5-1.5 1-2l3.5-3.5 1 4z" />
            <path d="M18.37 3.63a2.12 2.12 0 0 1 3 3L9 19l-4 1 1-4L18.37 3.63z" />
        </svg>
    );
}

const ALL = [...ITEMS, ...ITEMS, ...ITEMS];

function MarqueeBand() {
    return (
        <div className="marquee-band" aria-hidden="true">
            <div className="marquee-track">
                {ALL.map((item, i) => (
                    <span className="marquee-item" key={i}>
                        <span className="marquee-icon">{item.icon}</span>
                        {item.text}
                        <span className="marquee-dot">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default MarqueeBand;
