import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CartItem = { id: string; qty: number };
export type Address = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
};
type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  address: Address;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  markViewed: (id: string) => void;
  saveAddress: (a: Partial<Address>) => void;
};

const Ctx = createContext<StoreState | null>(null);
const KEY = "shopai_store_v2";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [address, setAddress] = useState<Address>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCart(s.cart ?? []);
        setWishlist(s.wishlist ?? []);
        setRecentlyViewed(s.recentlyViewed ?? []);
        setAddress(s.address ?? {});
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, recentlyViewed, address }));
  }, [cart, wishlist, recentlyViewed, address, hydrated]);

  const addToCart = (id: string, qty = 1) =>
    setCart((c) => {
      const ex = c.find((i) => i.id === id);
      if (ex) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { id, qty }];
    });
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))));
  const clearCart = () => setCart([]);
  const toggleWishlist = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const markViewed = (id: string) =>
    setRecentlyViewed((v) => [id, ...v.filter((x) => x !== id)].slice(0, 8));
  const saveAddress = (a: Partial<Address>) => setAddress((cur) => ({ ...cur, ...a }));

  return (
    <Ctx.Provider value={{ cart, wishlist, recentlyViewed, address, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, markViewed, saveAddress }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
