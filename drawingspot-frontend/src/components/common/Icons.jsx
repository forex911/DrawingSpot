// Premium inline SVG icon components — no emoji, no external deps

const defaults = { width: 24, height: 24, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

function Svg({ size = 24, color, className, children, viewBox = "0 0 24 24" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={viewBox}
            fill="none"
            stroke={color || "currentColor"}
            strokeWidth={defaults.strokeWidth}
            strokeLinecap={defaults.strokeLinecap}
            strokeLinejoin={defaults.strokeLinejoin}
            className={className}
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

// ── Brand / Logo ──────────────────────────────────────────────
export function IconBrush({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M12 19.5c0 1.38-1.12 2.5-2.5 2.5S7 20.88 7 19.5c0-.87.5-1.5 1-2l3.5-3.5 1 4z" />
            <path d="M18.37 3.63a2.12 2.12 0 0 1 3 3L9 19l-4 1 1-4L18.37 3.63z" />
        </Svg>
    );
}

// ── Pencil (B&W category) ────────────────────────────────────
export function IconPencil({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </Svg>
    );
}

// ── Colour Palette ──────────────────────────────────────────
export function IconPalette({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </Svg>
    );
}

// ── Single Person ───────────────────────────────────────────
export function IconPerson({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </Svg>
    );
}

// ── Couple / Two People ─────────────────────────────────────
export function IconCouple({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
    );
}

// ── Family / Group ───────────────────────────────────────────
export function IconFamily({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
    );
}

// ── Shopping Cart ────────────────────────────────────────────
export function IconCart({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </Svg>
    );
}

// ── Heart ────────────────────────────────────────────────────
export function IconHeart({ size, color, className, filled }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={filled ? "currentColor" : "none"}
            />
        </Svg>
    );
}

// ── Truck / Shipping ─────────────────────────────────────────
export function IconTruck({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 5v4h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </Svg>
    );
}

// ── Shield / Secure ──────────────────────────────────────────
export function IconShield({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </Svg>
    );
}

// ── Package / COD ─────────────────────────────────────────────
export function IconPackage({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
        </Svg>
    );
}

// ── Check / Verified ─────────────────────────────────────────
export function IconCheck({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <polyline points="20 6 9 17 4 12" />
        </Svg>
    );
}

// ── Frame / Picture ──────────────────────────────────────────
export function IconFrame({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
        </Svg>
    );
}

// ── Eye / Preview ────────────────────────────────────────────
export function IconEye({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </Svg>
    );
}

// ── Refresh / Revisions ──────────────────────────────────────
export function IconRefresh({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </Svg>
    );
}

// ── Upload / Photo ───────────────────────────────────────────
export function IconUpload({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </Svg>
    );
}

// ── Star ─────────────────────────────────────────────────────
export function IconStar({ size, color, className, filled }) {
    return (
        <Svg size={size} color={color} className={className}>
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={filled ? "currentColor" : "none"}
            />
        </Svg>
    );
}

// ── Arrow Right ──────────────────────────────────────────────
export function IconArrowRight({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </Svg>
    );
}

// ── Clock ────────────────────────────────────────────────────
export function IconClock({ size, color, className }) {
    return (
        <Svg size={size} color={color} className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </Svg>
    );
}
