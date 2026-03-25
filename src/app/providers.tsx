"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/hooks/use-cart";
import { WishlistProvider } from "@/lib/hooks/use-wishlist";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
