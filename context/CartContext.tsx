import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  subtotal: number;
  shipping: number;
  total: number;
  applyDiscount: (code: string) => { success: boolean; message: string; amount?: number };
  discount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FIXED_SHIPPING_COST = 10;
const DISCOUNT_CODES: Record<string, number> = {
  'IMRU2': 0.2 // 20%
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cart' && e.newValue) {
            try {
                setCart(JSON.parse(e.newValue));
            } catch (error) {
                console.error("Sync error", error);
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountRate(0);
  };

  const applyDiscount = (code: string) => {
    const rate = DISCOUNT_CODES[code.toUpperCase()];
    if (rate) {
      setDiscountRate(rate);
      return { success: true, message: `Discount applied: ${code.toUpperCase()} (${rate * 100}%)`, amount: subtotal * rate };
    }
    setDiscountRate(0);
    return { success: false, message: 'Invalid discount code' };
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const shipping = cart.length > 0 ? FIXED_SHIPPING_COST : 0;
  const total = (subtotal - discountAmount) + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal: subtotal - discountAmount, // effectively discounted subtotal
        shipping,
        total,
        applyDiscount,
        discount: discountAmount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};