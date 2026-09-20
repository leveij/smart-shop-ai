import type { ReactNode } from "react";

export function SectionRow({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
