import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { type Product } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const liked = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:glow relative flex flex-col">
      {product.badge && (
        <span className={cn(
          "absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-md",
          product.badge === "Deal" && "bg-destructive/80 text-destructive-foreground",
          product.badge === "Bestseller" && "bg-accent/90 text-accent-foreground",
          product.badge === "New" && "bg-primary/80 text-primary-foreground",
          product.badge === "Trending" && "bg-foreground/80 text-background",
        )}>{product.badge}</span>
      )}
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label="wishlist"
        className="absolute top-3 right-3 z-10 size-9 rounded-full grid place-items-center glass-strong transition hover:scale-110"
      >
        <Heart className={cn("size-4", liked ? "fill-destructive text-destructive" : "text-foreground")} />
      </button>

      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
        <Link to="/products/$id" params={{ id: product.id }} className="font-semibold leading-tight line-clamp-2 hover:text-primary transition">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs">
          <Star className="size-3 fill-accent text-accent" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
          <span className="text-xs text-success font-semibold">{discount}% off</span>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          className="mt-2 w-full rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground font-medium py-2 text-sm transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="size-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
