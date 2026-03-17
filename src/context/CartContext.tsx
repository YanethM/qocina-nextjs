"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

export interface CartItem {
  id: number;
  documentId: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  precio: number;
  precioMoneda: string;
  imagen: string | null;
  cantidad: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  removeItem: (id: number) => void;
  updateCantidad: (id: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  toastVisible: boolean;
  toastNombre: string;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastNombre, setToastNombre] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("qocina_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("qocina_cart", JSON.stringify(items));
  }, [items]);

  const dismissToast = useCallback(() => {
    setToastVisible(false);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "cantidad">, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { ...item, cantidad }];
    });
    setToastNombre(item.nombre);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 4000);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateCantidad = useCallback((id: number, cantidad: number) => {
    if (cantidad < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateCantidad, clearCart, total, count, toastVisible, toastNombre, dismissToast }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
