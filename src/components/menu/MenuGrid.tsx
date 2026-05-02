"use client";

import { useState } from "react";
import { MenuCategory, MenuItem } from "@/lib/types";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuGrid({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => {
          const cat = categories.find((c) => c.id === i.category_id);
          return cat?.slug === activeCategory;
        });

  return (
    <div>
      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center py-12" style={{ color: "#8a6a3a" }}>
            No items in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
