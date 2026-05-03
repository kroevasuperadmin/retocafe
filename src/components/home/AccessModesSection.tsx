"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const dishes = [
  {
    title: "Signature Shawarma",
    subtitle: "Built hot, wrapped tight.",
    body: "Tender meat, garlic sauce, pickles, and warm bread straight off the grill. This is the first thing most people come back for.",
    accent: "#f59e0b",
  },
  {
    title: "Rice Platters",
    subtitle: "Proper portions, serious comfort.",
    body: "Mandi, makluba, and rice dishes served steaming with rich spice, fresh sides, and enough heft for a full meal.",
    accent: "#d4a96a",
  },
  {
    title: "Fresh Drinks",
    subtitle: "Cool down after the heat.",
    body: "Juices, milkshakes, and iced drinks made to balance the meal and keep the table moving.",
    accent: "#fef3c7",
  },
];

const featureStrip = ["shawarma", "grill", "rice platters", "fresh drinks", "late-night comfort", "house sauces"];

export default function AccessModesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24 relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.65), transparent)" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(245,158,11,0.08)" }}
        animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-0 bottom-4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(212,169,106,0.08)" }}
        animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="mb-10 overflow-hidden rounded-full border"
        style={{ backgroundColor: "rgba(26,17,8,0.6)", borderColor: "#3d2a0e" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div
          className="flex gap-8 px-5 py-3 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...featureStrip, ...featureStrip].map((item, index) => (
            <span key={`${item}-${index}`} className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: "#d4a96a" }}>
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap relative z-10">
        <div>
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "#f59e0b" }}>
            Customer Picks
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#fef3c7" }}>
            Three things worth ordering first
          </h2>
        </div>
        <Link
          href="/menu"
          className="inline-block font-semibold px-6 py-3 rounded-full border transition-all hover:border-[#f59e0b] hover:text-[#f59e0b]"
          style={{ borderColor: "#3d2a0e", color: "#d4a96a" }}
        >
          Browse Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dishes.map((dish, index) => (
        <motion.div
          key={dish.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: index * 0.1 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="rounded-2xl border p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)" }}
          />
          <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: dish.accent }}>
            {dish.title}
          </span>
          <h3 className="text-2xl font-bold" style={{ color: "#fef3c7" }}>
            {dish.subtitle}
            </h3>
            <p className="leading-relaxed" style={{ color: "#8a6a3a" }}>
              {dish.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
