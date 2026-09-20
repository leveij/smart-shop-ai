import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { cn } from "@/lib/utils";

const search = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop All Products — ShopAI" },
      { name: "description", content: "Browse all products with smart filters, sorting, and AI-ranked results." },
    ],
  }),
  component: ProductsPage,
});

type Sort = "relevance" | "price-asc" | "price-desc" | "rating";

function ProductsPage() {
  const { category, q } = Route.useSearch();
  const [sort, setSort] = useState<Sort>("relevance");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [brand, setBrand] = useState<string | null>(null);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (q) {
      const term = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term));
    }
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, q, maxPrice, minRating, brand, sort]);

  const cat = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{cat ? `${cat.icon} ${cat.name}` : "All Products"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters */}
        <aside className="glass rounded-2xl p-5 space-y-6 h-fit lg:sticky lg:top-32">
          <div>
            <h3 className="font-semibold mb-2">Max Price</h3>
            <input type="range" min={500} max={100000} step={500} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
            <div className="text-sm text-muted-foreground mt-1">Up to ₹{maxPrice.toLocaleString()}</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Minimum Rating</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button key={r} onClick={() => setMinRating(r)}
                  className={cn("px-3 py-1 rounded-full text-xs border transition",
                    minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary")}>
                  {r === 0 ? "Any" : `${r}★+`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Brand</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              <button onClick={() => setBrand(null)}
                className={cn("px-3 py-1 rounded-full text-xs border transition",
                  !brand ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary")}>All</button>
              {brands.map((b) => (
                <button key={b} onClick={() => setBrand(b)}
                  className={cn("px-3 py-1 rounded-full text-xs border transition",
                    brand === b ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary")}>{b}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-input/60 border border-border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
