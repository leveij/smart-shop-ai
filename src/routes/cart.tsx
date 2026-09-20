import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Tag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { getProduct } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — ShopAI" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const items = cart.map((c) => ({ ...c, product: getProduct(c.id) })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + (i.product!.price * i.qty), 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-3xl p-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Add some products to get started.</p>
          <Link to="/products" className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-105 transition">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="glass rounded-2xl p-4 flex gap-4">
              <Link to="/products/$id" params={{ id: i.product!.id }} className="size-24 sm:size-28 shrink-0 rounded-xl overflow-hidden">
                <img src={i.product!.image} alt={i.product!.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{i.product!.brand}</div>
                <Link to="/products/$id" params={{ id: i.product!.id }} className="font-semibold line-clamp-2 hover:text-primary transition">{i.product!.name}</Link>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center glass-strong rounded-full">
                    <button onClick={() => updateQty(i.id, i.qty - 1)} className="size-8 grid place-items-center"><Minus className="size-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => updateQty(i.id, i.qty + 1)} className="size-8 grid place-items-center"><Plus className="size-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(i.id)} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition">
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{formatPrice(i.product!.price * i.qty)}</div>
                <div className="text-xs text-muted-foreground">{formatPrice(i.product!.price)} each</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="glass-strong rounded-2xl p-5 h-fit lg:sticky lg:top-32 space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Tag className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code"
                className="w-full bg-input/60 border border-border rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button onClick={() => setApplied(coupon.toUpperCase() === "SHOPAI25" || coupon.length > 2)}
              className="rounded-full bg-secondary px-4 text-sm font-semibold hover:bg-secondary/80 transition">Apply</button>
          </div>
          {applied && <div className="text-xs text-success">✓ Coupon applied — 10% off</div>}

          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Truck className="size-4 text-accent" /> Estimated delivery in 3–5 days
          </div>

          <Link to="/checkout" className="block text-center w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold hover:scale-[1.02] transition glow">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
