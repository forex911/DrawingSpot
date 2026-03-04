import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconCart } from "./Icons";
import "../../App.css";

function CartDrawer() {
    const {
        items,
        isOpen,
        setIsOpen,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();

    const navigate = useNavigate();

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [setIsOpen]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);


    return (
        <>

            {/* Backdrop */}
            <div
                className={`cart-backdrop${isOpen ? " open" : ""}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div className={`cart-drawer${isOpen ? " open" : ""}`} role="dialog" aria-label="Shopping Cart">
                {/* Header */}
                <div className="cart-header">
                    <div>
                        <h3 className="cart-title">Your Cart</h3>
                        {totalItems > 0 && (
                            <span className="cart-count-label">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                        )}
                    </div>
                    <button className="cart-close-btn" onClick={() => setIsOpen(false)} aria-label="Close cart">✕</button>
                </div>

                {/* Body */}
                <div className="cart-body">
                    {items.length === 0 ? (
                        <div className="cart-empty">

                            <div className="cart-empty-icon"><IconCart size={36} color="var(--muted)" /></div>
                            <p className="cart-empty-text">Your cart is empty</p>
                            <p className="cart-empty-sub">Find something beautiful in our gallery!</p>
                            <button className="btn-primary cart-browse-btn" onClick={() => { setIsOpen(false); navigate("/gallery"); }} >
                                Browse Art
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="cart-items-list">
                                {items.map((item) => (
                                    <li className="cart-item" key={item.id}>
                                        <img src={item.img} alt={item.title} className="cart-item-img" />
                                        <div className="cart-item-info">
                                            <p className="cart-item-title">{item.title}</p>
                                            <p className="cart-item-artist">{item.artist}</p>
                                            <p className="cart-item-price">{item.price}</p>
                                            <div className="cart-qty-row">
                                                <button
                                                    className="cart-qty-btn"
                                                    onClick={() => updateQty(item.id, -1)}
                                                    aria-label="Decrease quantity"
                                                >−</button>
                                                <span className="cart-qty-num">{item.qty}</span>
                                                <button
                                                    className="cart-qty-btn"
                                                    onClick={() => updateQty(item.id, 1)}
                                                    aria-label="Increase quantity"
                                                >+</button>
                                            </div>
                                        </div>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >✕</button>
                                    </li>
                                ))}
                            </ul>

                            {/* Clear cart */}
                            <button className="cart-clear-btn" onClick={clearCart}>
                                Clear all
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <span className="cart-subtotal-price">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="cart-footer-note">Shipping & framing calculated at checkout</p>
                        <Link to="/order" onClick={() => setIsOpen(false)}>
                            <button className="btn-primary cart-checkout-btn">
                                Proceed to Order →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartDrawer;
