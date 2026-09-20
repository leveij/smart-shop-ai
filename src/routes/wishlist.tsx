import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your Wishlist — ShopAI" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-xl font-semibold">Save things you love</h2>
          <p className="text-muted-foreground mt-2">Tap the heart on any product to add it here.</p>
          <Link to="/products" className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-105 transition">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
