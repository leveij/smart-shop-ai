import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Smartphone, Truck, Lock, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ShopAI" },
      { name: "description", content: "Securely complete your ShopAI order with UPI, card, or cash on delivery." },
    ],
  }),
  component: CheckoutPage,
});

type PayMethod = "upi" | "card" | "cod";

function CheckoutPage() {
  const { cart, clearCart, address, saveAddress } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("upi");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: address.name ?? "",
    email: address.email ?? "",
    phone: address.phone ?? "",
    address: address.address ?? "",
    city: address.city ?? "",
    pincode: address.pincode ?? "",
    upi: "", card: "", expiry: "", cvv: "",
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: f.name || address.name || "",
      email: f.email || address.email || "",
      phone: f.phone || address.phone || "",
      address: f.address || address.address || "",
      city: f.city || address.city || "",
      pincode: f.pincode || address.pincode || "",
    }));
  }, [address]);

  const items = useMemo(
    () => cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id)! })).filter((i) => i.product),
    [cart],
  );
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || placing) return;
    saveAddress({ name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode });
    setPlacing(true);
    setTimeout(() => {
      const id = "SA" + Math.random().toString(36).slice(2, 8).toUpperCase();
      clearCart();
      setPlaced(id);
      setPlacing(false);
    }, 1200);
  }

  if (placed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="glass-strong rounded-3xl p-10">
          <CheckCircle2 className="size-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order placed!</h1>
          <p className="text-muted-foreground">Thank you for shopping with ShopAI.</p>
          <div className="mt-6 inline-block glass rounded-2xl px-5 py-3">
            <div className="text-xs text-muted-foreground">Order ID</div>
            <div className="font-mono font-bold text-lg">{placed}</div>
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/" className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-105 transition">Continue shopping</Link>
            <button onClick={() => navigate({ to: "/products" })} className="rounded-full glass-strong px-6 py-3 font-semibold">Browse more</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link to="/products" className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold">Shop products</Link>
      </div>
    );
  }

  const input = "w-full bg-input/60 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to cart
      </Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder="Full name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" placeholder="Email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required placeholder="Phone" className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required placeholder="Pincode" className={input} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              <input required placeholder="Address" className={cn(input, "sm:col-span-2")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input required placeholder="City" className={input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </section>

          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Payment method</h2>
            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <MethodButton active={method === "upi"} onClick={() => setMethod("upi")} icon={<Smartphone className="size-5" />} label="UPI" hint="GPay, PhonePe" />
              <MethodButton active={method === "card"} onClick={() => setMethod("card")} icon={<CreditCard className="size-5" />} label="Card" hint="Credit / Debit" />
              <MethodButton active={method === "cod"} onClick={() => setMethod("cod")} icon={<Truck className="size-5" />} label="Cash on Delivery" hint="Pay at door" />
            </div>

            {method === "upi" && (
              <input required placeholder="yourname@upi" className={input} value={form.upi} onChange={(e) => setForm({ ...form, upi: e.target.value })} />
            )}
            {method === "card" && (
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="Card number" className={cn(input, "sm:col-span-2")} value={form.card} onChange={(e) => setForm({ ...form, card: e.target.value })} />
                <input required placeholder="MM/YY" className={input} value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
                <input required placeholder="CVV" className={input} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} />
              </div>
            )}
            {method === "cod" && (
              <p className="text-sm text-muted-foreground">Pay with cash when your order arrives. A small handling fee may apply.</p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <Lock className="size-3.5" /> This is a demo checkout — no real payment is processed.
            </div>
          </section>
        </div>

        <aside className="glass-strong rounded-2xl p-6 h-fit lg:sticky lg:top-24 space-y-4">
          <h2 className="font-semibold text-lg">Order summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3 text-sm">
                <img src={i.product.image} alt="" className="size-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {i.qty}</div>
                </div>
                <div className="font-semibold">{formatPrice(i.product.price * i.qty)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm pt-4 border-t border-border">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : formatPrice(shipping)} />
            <Row label="Tax (5%)" value={formatPrice(tax)} />
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold hover:scale-[1.02] transition glow disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Pay ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}

function MethodButton({ active, onClick, icon, label, hint }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl p-4 text-left border transition",
        active ? "border-primary bg-primary/10 glow" : "border-border glass hover:border-primary/50",
      )}
    >
      <div className="flex items-center gap-2 font-semibold">{icon} {label}</div>
      <div className="text-xs text-muted-foreground mt-1">{hint}</div>
    </button>
  );
}
