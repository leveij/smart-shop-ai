import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border glass-strong">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-lg grid place-items-center" style={{ background: "var(--gradient-hero)" }}>
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Shop<span className="gradient-text">AI</span></span>
          </div>
          <p className="text-muted-foreground">Smart shopping powered by AI. Personalized for you.</p>
        </div>
        {[
          { title: "Shop", items: ["All Products", "Deals", "New Arrivals", "Best Sellers"] },
          { title: "Help", items: ["Track Order", "Returns", "Shipping", "Contact"] },
          { title: "Company", items: ["About", "Careers", "Press", "Privacy"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2 text-muted-foreground">
              {col.items.map((i) => <li key={i} className="hover:text-foreground cursor-pointer transition">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 ShopAI · Built with intelligence
      </div>
    </footer>
  );
}
