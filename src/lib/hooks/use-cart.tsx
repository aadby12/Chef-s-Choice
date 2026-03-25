"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/domain";

export type CartItem = {
  product: Pick<Product, "id" | "name" | "slug" | "price" | "sku" | "stock"> & {
    image?: string | null;
  };
  qty: number;
};

type CartState = { items: CartItem[] };

const STORAGE_KEY = "cc-cart-v1";

const CartContext = createContext<{
  items: CartItem[];
  addItem: (product: CartItem["product"], qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
} | null>(null);

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(items);
  }, [items, ready]);

  const addItem = useCallback((product: CartItem["product"], qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.product.id === product.id);
      if (i === -1) return [...prev, { product, qty }];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, product.stock || 99) };
      return next;
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.product.id === productId
            ? { ...it, qty: Math.max(0, Math.min(qty, it.product.stock || 99)) }
            : it
        )
        .filter((it) => it.qty > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.product.price * it.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, setQty, removeItem, clear, subtotal, count }),
    [items, addItem, setQty, removeItem, clear, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
