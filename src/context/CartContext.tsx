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
  sku: string | null;
  categoria: string | null;
  color?: string | null;
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
const DEFAULT_CURRENCY = "COP";

function getOrCreateCartId(): string {
  const existing = localStorage.getItem("qocina_cart_id");
  if (existing) return existing;
  const id = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("qocina_cart_id", id);
  return id;
}

function normalizeCartItem(item: Partial<CartItem>): CartItem | null {
  if (
    typeof item.id !== "number" ||
    typeof item.documentId !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.nombre !== "string" ||
    typeof item.descripcionCorta !== "string" ||
    typeof item.precio !== "number"
  ) {
    return null;
  }

  return {
    id: item.id,
    documentId: item.documentId,
    slug: item.slug,
    nombre: item.nombre,
    descripcionCorta: item.descripcionCorta,
    precio: item.precio,
    precioMoneda:
      typeof item.precioMoneda === "string" && item.precioMoneda.trim()
        ? item.precioMoneda
        : DEFAULT_CURRENCY,
    imagen: typeof item.imagen === "string" || item.imagen === null ? item.imagen : null,
    cantidad: typeof item.cantidad === "number" && item.cantidad > 0 ? item.cantidad : 1,
    sku: typeof item.sku === "string" ? item.sku : null,
    categoria: typeof item.categoria === "string" ? item.categoria : null,
    color: typeof item.color === "string" ? item.color : null,
  };
}

function loadInitialCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("qocina_cart");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed
          .map((item) => normalizeCartItem(item))
          .filter((item): item is CartItem => item !== null)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCartItems);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastNombre, setToastNombre] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsRef = useRef<CartItem[]>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    localStorage.setItem("qocina_cart", JSON.stringify(items));
  }, [items]);

  const dismissToast = useCallback(() => {
    setToastVisible(false);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "cantidad">, cantidad = 1) => {
    const normalizedItem = {
      ...item,
      precioMoneda:
        typeof item.precioMoneda === "string" && item.precioMoneda.trim()
          ? item.precioMoneda
          : DEFAULT_CURRENCY,
    };
    setItems((prev) => {
      const existing = prev.find((i) => i.id === normalizedItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === normalizedItem.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { ...normalizedItem, cantidad }];
    });

    if (typeof window !== "undefined" && window.cioanalytics) {
      const cartId = getOrCreateCartId();
      window.cioanalytics.track("Product Added", {
        cart_id: cartId,
        product_id: String(normalizedItem.id),
        sku: normalizedItem.sku ?? normalizedItem.slug,
        name: normalizedItem.nombre,
        category: normalizedItem.categoria ?? null,
        price: normalizedItem.precio,
        quantity: cantidad,
        brand: "QCocina",
        image_url: normalizedItem.imagen ?? null,
      });
    }

    setToastNombre(normalizedItem.nombre);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 4000);
  }, []);

  const removeItem = useCallback((id: number) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (item && typeof window !== "undefined" && window.cioanalytics) {
      const cartId = localStorage.getItem("qocina_cart_id") ?? "";
      window.cioanalytics.track("Product Removed", {
        cart_id: cartId,
        product_id: String(item.id),
        sku: item.sku ?? item.slug,
        name: item.nombre,
        category: item.categoria ?? null,
        price: item.precio,
        quantity: item.cantidad,
      });
    }
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
