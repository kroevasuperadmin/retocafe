"use client";

import { MenuCategory } from "@/lib/types";

interface Props {
  categories: MenuCategory[];
  active: string;
  onChange: (slug: string) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  const tabs = [{ id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div
      className="sticky top-16 z-20 -mx-4 px-4 py-3 mb-2 border-y"
      style={{
        background: "linear-gradient(to bottom, rgba(26,17,8,0.98), rgba(26,17,8,0.86))",
        borderColor: "#3d2a0e",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {tabs.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
            style={
              active === cat.slug
                ? { backgroundColor: "#f59e0b", color: "#1a1108", borderColor: "#f59e0b" }
                : { backgroundColor: "#241608", color: "#d4a96a", borderColor: "#3d2a0e" }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
