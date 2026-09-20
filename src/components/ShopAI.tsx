import { useNavigate } from "@tanstack/react-router";
import { Send, Sparkles, X, ShoppingCart, MapPin, CreditCard, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getProduct } from "@/lib/products";
import { formatPrice, useStore, type Address } from "@/lib/store";

type Action =
  | { type: "add_to_cart"; productId: string; qty?: number }
  | { type: "remove_from_cart"; productId: string }
  | { type: "clear_cart" }
  | { type: "save_address"; address: Partial<Address> }
  | { type: "go_to_checkout" }
  | { type: "go_to_cart" };

type Msg = {
  role: "user" | "assistant";
  content: string;
  events?: { icon: "cart" | "address" | "checkout" | "trash"; text: string }[];
};

const ICONS = {
  cart: ShoppingCart,
  address: MapPin,
  checkout: CreditCard,
  trash: Trash2,
} as const;

export function ShopAI() {
  const navigate = useNavigate();
  const { cart, address, addToCart, removeFromCart, clearCart, saveAddress } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ShopAI 👋 Tell me what you want — like 'get me the best laptop' or 'add running shoes and check out'. I'll add to cart and take you to payment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  function runActions(actions: Action[]): Msg["events"] {
    const events: NonNullable<Msg["events"]> = [];
    let goCheckout = false;
    let goCart = false;
    for (const a of actions) {
      if (!a || typeof a !== "object") continue;
      switch (a.type) {
        case "add_to_cart": {
          const p = getProduct(a.productId);
          if (p) {
            const qty = Math.max(1, Number(a.qty) || 1);
            addToCart(p.id, qty);
            events.push({ icon: "cart", text: `Added ${p.name} × ${qty} — ${formatPrice(p.price * qty)}` });
          }
          break;
        }
        case "remove_from_cart": {
          const p = getProduct(a.productId);
          if (p) {
            removeFromCart(p.id);
            events.push({ icon: "trash", text: `Removed ${p.name}` });
          }
          break;
        }
        case "clear_cart":
          clearCart();
          events.push({ icon: "trash", text: "Cleared your cart" });
          break;
        case "save_address": {
          const clean: Partial<Address> = {};
          for (const k of ["name", "email", "phone", "address", "city", "pincode"] as const) {
            const v = a.address?.[k];
            if (typeof v === "string" && v.trim()) clean[k] = v.trim();
          }
          if (Object.keys(clean).length) {
            saveAddress(clean);
            events.push({ icon: "address", text: `Saved ${Object.keys(clean).join(", ")}` });
          }
          break;
        }
        case "go_to_cart":
          goCart = true;
          break;
        case "go_to_checkout":
          goCheckout = true;
          break;
      }
    }
    if (goCheckout) {
      events.push({ icon: "checkout", text: "Opening checkout…" });
      setTimeout(() => navigate({ to: "/checkout" }), 400);
    } else if (goCart) {
      events.push({ icon: "cart", text: "Opening cart…" });
      setTimeout(() => navigate({ to: "/cart" }), 400);
    }
    return events;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const nextHistory: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          context: { cart, address },
        }),
      });
      if (!res.ok) {
        const msg =
          res.status === 429
            ? "I'm getting too many requests. Try again in a moment."
            : res.status === 402
              ? "AI credits are exhausted. Please add credits to keep chatting."
              : "Sorry, something went wrong.";
        setMessages((m) => [...m, { role: "assistant", content: msg }]);
      } else {
        const data = (await res.json()) as { reply: string; actions: Action[] };
        const events = runActions(data.actions ?? []);
        setMessages((m) => [...m, { role: "assistant", content: data.reply || "Done.", events }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Please retry." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full grid place-items-center glow animate-float transition hover:scale-110"
        style={{ background: "var(--gradient-hero)" }}
        aria-label="Open ShopAI"
      >
        {open ? <X className="size-6 text-primary-foreground" /> : <Sparkles className="size-6 text-primary-foreground" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-3rem))] h-[min(600px,calc(100vh-8rem))] glass-strong rounded-3xl flex flex-col overflow-hidden shadow-2xl gradient-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="size-9 rounded-xl grid place-items-center" style={{ background: "var(--gradient-hero)" }}>
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold leading-tight">ShopAI</div>
              <div className="text-xs text-muted-foreground">Shops & checks out for you</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm bg-primary text-primary-foreground"
                      : "max-w-[90%] text-sm leading-relaxed text-foreground whitespace-pre-wrap"
                  }
                >
                  {m.content}
                  {m.events && m.events.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {m.events.map((ev, j) => {
                        const Icon = ICONS[ev.icon];
                        return (
                          <div key={j} className="flex items-center gap-2 text-xs glass rounded-xl px-3 py-2">
                            <Icon className="size-3.5 text-accent shrink-0" />
                            <span>{ev.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="size-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                <span className="size-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Try: get me the best laptop and check out"
              className="flex-1 bg-input/60 border border-border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="size-10 shrink-0 rounded-full grid place-items-center bg-primary text-primary-foreground disabled:opacity-40 transition hover:scale-105"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
