import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToCart = useCallback((product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setIsOpen(true); // auto-open drawer on add
    }, []);

    const removeFromCart = useCallback((id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQty = useCallback((id, delta) => {
        setItems((prev) =>
            prev
                .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
                .filter((i) => i.qty > 0)
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalItems = items.reduce((s, i) => s + i.qty, 0);

    const totalPrice = items.reduce((s, i) => {
        const num = parseInt(i.price.replace(/[^\d]/g, ""), 10) || 0;
        return s + num * i.qty;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                setIsOpen,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
