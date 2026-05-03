"use client";

import { motion } from "framer-motion";
import { MenuCategory, MenuItem } from "@/lib/types";
import MenuGrid from "./MenuGrid";
import { Sparkles, Flame, TimerReset, Utensils } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuShowcase({ categories, items }: Props) {
  const featured = items.slice(0, 3);
  const journeyStats = [
    { label: "Categories", value: `${categories.length}`, icon: Utensils },
    { label: "Fresh picks", value: `${items.length}`, icon: Flame },
    { label: "Fast browse", value: "Tap to filter", icon: TimerReset },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border p-6 md:p-8 lg:p-10"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(245,158,11,0.16), transparent 34%), linear-gradient(180deg, rgba(36,22,8,0.96) 0%, rgba(26,17,8,0.98) 100%)",
          borderColor: "#3d2a0e",
        }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(245,158,11,0.14)" }}
          animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(212,169,106,0.1)" }}
          animate={{ x: [0, 22, 0], y: [0, -12, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-10 items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: "#f59e0b" }}>
              Menu Experience
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.94] mb-5" style={{ color: "#fef3c7" }}>
              Enter the room, then choose your next craving.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "#d4a96a" }}>
              The menu should unfold like a guided browse: first the mood, then the highlights, then the full spread.
              Tap a category and the gallery reshapes itself in place.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {journeyStats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 + index * 0.08 }}
                    className="rounded-2xl border px-4 py-4 backdrop-blur-xl"
                    style={{ backgroundColor: "rgba(26,17,8,0.4)", borderColor: "#3d2a0e" }}
                  >
                    <Icon size={18} style={{ color: "#f59e0b" }} />
                    <p className="mt-3 text-2xl font-bold" style={{ color: "#fef3c7" }}>
                      {item.value}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#fef3c7" }}>
                      {item.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {featured.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + index * 0.08 }}
                className={`rounded-3xl overflow-hidden border ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
              >
                <div className={`relative ${index === 0 ? "h-72 sm:h-full" : "h-56"}`}>
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #3d2a0e 0%, #241608 100%)" }}>
                      <Sparkles size={24} style={{ color: "#f59e0b" }} />
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(26,17,8,0.9) 0%, rgba(26,17,8,0.34) 45%, transparent 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] mb-1" style={{ color: "#d4a96a" }}>
                      {item.category?.name ?? "Featured"}
                    </p>
                    <h2 className={`${index === 0 ? "text-2xl" : "text-lg"} font-bold`} style={{ color: "#fef3c7" }}>
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "#d4a96a" }}>
                      {item.description ?? "Fresh, made to order."}
                    </p>
                    <p className="mt-2 text-sm font-bold" style={{ color: "#f59e0b" }}>
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 md:mt-14"
      >
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "#f59e0b" }}>
              Full Spread
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#fef3c7" }}>
              Browse the full kitchen lineup
            </h2>
          </div>
          <p className="max-w-xl text-sm md:text-base" style={{ color: "#8a6a3a" }}>
            Filter by category, then tap into the dishes that fit the mood.
          </p>
        </div>
        <MenuGrid categories={categories} items={items} />
      </motion.section>
    </div>
  );
}
