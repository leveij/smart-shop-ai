import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { categories } from "@/lib/products";

export function Header() {
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="size-9 rounded-xl grid place-items-center" style={{ background: "var(--gradient-hero)" }}>
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">
            Shop<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="flex-1 max-w-2xl relative">
          <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for products, brands, categories..."
            className="w-full bg-input/60 border border-border rounded-full pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition placeholder:text-muted-foreground"
          />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link to="/wishlist" className="relative size-10 grid place-items-center rounded-full hover:bg-secondary transition" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/cart" className="relative size-10 grid place-items-center rounded-full hover:bg-secondary transition" aria-label="Cart">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center">{cartCount}</span>
            )}
          </Link>
          <button className="size-10 grid place-items-center rounded-full hover:bg-secondary transition" aria-label="Account">
            <User className="size-5" />
          </button>
        </nav>
      </div>

      <div className="border-t border-border/60 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex gap-1 text-sm">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.slug }}
              className="shrink-0 px-3 py-1.5 rounded-full hover:bg-secondary transition flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
