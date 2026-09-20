import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/ProductCard";
import { SectionRow } from "@/components/SectionRow";
import { categories, products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopAI — Smart shopping, personalized by AI" },
      { name: "description", content: "Discover deals, trending products, and AI-curated recommendations on ShopAI." },
    ],
  }),
  component: Home,
});

function Home() {
  const { recentlyViewed } = useStore();
  const trending = products.filter((p) => p.badge === "Trending" || p.rating >= 4.6).slice(0, 8);
  const deals = products.filter((p) => p.badge === "Deal" || p.mrp - p.price > 1500).slice(0, 6);
  const bestsellers = products.filter((p) => p.badge === "Bestseller").slice(0, 8);
  const newArrivals = products.filter((p) => p.badge === "New").slice(0, 6);
  const recommended = [...products].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 8);
  const recent = recentlyViewed.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 6) as typeof products;

  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="relative overflow-hidden rounded-3xl glass-strong gradient-border">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, oklch(0.16 0.025 270 / 90%) 0%, oklch(0.16 0.025 270 / 60%) 50%, transparent 100%)" }} />
          <div className="relative px-6 sm:px-12 py-16 sm:py-24 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-4">
              <Sparkles className="size-3.5 text-accent" /> AI-Powered Shopping Assistant
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
              Shopping that <span className="gradient-text">learns you</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Personalized recommendations, real-time deals, and a smart assistant that helps you decide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-105 transition glow">
                Shop Now <ArrowRight className="size-4" />
              </Link>
              <Link to="/products" search={{ category: "electronics" }} className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 font-semibold hover:bg-secondary transition">
                <Zap className="size-4 text-accent" /> Flash Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((c) => (
            <Link key={c.slug} to="/products" search={{ category: c.slug }}
              className="glass rounded-2xl p-4 text-center hover:-translate-y-1 hover:glow transition">
              <div className="text-3xl mb-1">{c.icon}</div>
              <div className="text-xs font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      <SectionRow title="⚡ Flash Deals" subtitle="Limited-time prices, hand-picked for value">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      {/* RECOMMENDED FOR YOU */}
      <SectionRow title="✨ Recommended For You" subtitle="Curated by our AI based on trending shoppers like you">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      {/* TRENDING */}
      <SectionRow title="🔥 Trending Now" subtitle="What everyone is loving this week">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      {/* BESTSELLERS */}
      <SectionRow title="🏆 Best Sellers" subtitle="Top-rated by our community">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      {/* NEW ARRIVALS */}
      <SectionRow title="🆕 New Arrivals" subtitle="Fresh off the shelves">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </SectionRow>

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <SectionRow title="👀 Recently Viewed">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </SectionRow>
      )}

      {/* PERSONALIZED OFFER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 text-center">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <Sparkles className="size-8 mx-auto text-accent mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold">A personal offer, just for you</h3>
            <p className="mt-2 text-muted-foreground">Use code <span className="font-mono font-bold text-foreground">SHOPAI25</span> for an extra 25% off your first AI-recommended item.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
