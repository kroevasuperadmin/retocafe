"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem, MenuItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (menuItem: MenuItem, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem, notes = "") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menu_item.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_item.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menu_item: menuItem, quantity: 1, notes }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menu_item.id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menu_item.id !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.menu_item.id === menuItemId ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.menu_item.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
