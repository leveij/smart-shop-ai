import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SectionRow } from "@/components/SectionRow";
import { getProduct, products } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — ShopAI` },
      { name: "description", content: loaderData.product.description },
      { property: "og:title", content: loaderData.product.name },
      { property: "og:description", content: loaderData.product.description },
      { property: "og:image", content: loaderData.product.image },
    ] : [],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="p-20 text-center">Product not found</div>,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, markViewed } = useStore();
  const [qty, setQty] = useState(1);
  const liked = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  useEffect(() => { markViewed(product.id); }, [product.id, markViewed]);

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recommended = products.filter((p) => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
  const fbt = products.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden glass">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden glass cursor-pointer hover:glow transition">
                <img src={src} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-success text-sm font-semibold">
              <Star className="size-3.5 fill-current" /> {product.rating}
            </div>
            <span className="text-sm text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
          </div>

          <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
            <span className="text-success font-bold">{discount}% off</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-10 grid place-items-center">−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="size-10 grid place-items-center">+</button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => addToCart(product.id, qty)} className="rounded-full bg-secondary hover:bg-secondary/80 px-6 py-3.5 font-semibold flex items-center justify-center gap-2 transition">
              <ShoppingCart className="size-4" /> Add to Cart
            </button>
            <Link to="/cart" onClick={() => addToCart(product.id, qty)} className="rounded-full bg-primary text-primary-foreground hover:scale-[1.02] transition px-6 py-3.5 font-semibold flex items-center justify-center gap-2 glow">
              Buy Now
            </Link>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => toggleWishlist(product.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
              <Heart className={cn("size-4", liked && "fill-destructive text-destructive")} /> {liked ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
              <Share2 className="size-4" /> Share
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[
              { i: Truck, t: "Free Delivery", s: "On orders ₹499+" },
              { i: RotateCcw, t: "7-Day Returns", s: "Easy & free" },
              { i: Shield, t: "Secure Pay", s: "100% protected" },
            ].map((b) => (
              <div key={b.t} className="glass rounded-xl p-3 text-center">
                <b.i className="size-5 mx-auto mb-1 text-accent" />
                <div className="font-semibold">{b.t}</div>
                <div className="text-muted-foreground">{b.s}</div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-8 glass rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="contents">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <SectionRow title="Frequently Bought Together">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <ProductCard product={product} />
          {fbt.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      <SectionRow title="Similar Products">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {similar.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      <SectionRow title="You May Also Like">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>
    </div>
  );
}
