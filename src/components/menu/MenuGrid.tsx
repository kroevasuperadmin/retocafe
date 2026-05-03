"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuCategory, MenuItem } from "@/lib/types";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuGrid({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((i) => {
      const cat = categories.find((c) => c.id === i.category_id);
      return cat?.slug === activeCategory;
    });
  }, [activeCategory, categories, items]);

  return (
    <div>
      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6"
        >
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <MenuItemCard item={item} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center py-12" style={{ color: "#8a6a3a" }}>
              No items in this category yet.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
