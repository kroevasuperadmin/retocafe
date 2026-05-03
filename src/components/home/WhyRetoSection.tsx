"use client";

import { motion } from "framer-motion";

const features = [
  {
    num: "01",
    title: "Made Fresh Daily",
    body: "Every shawarma and every bowl of nasi arab is prepared the same day, never yesterday's leftovers.",
  },
  {
    num: "02",
    title: "Authentic Recipes",
    body: "Sourced from traditional Middle Eastern techniques, seasoned the way it's done in the source.",
  },
  {
    num: "03",
    title: "Order Your Way",
    body: "Dine in, takeaway, or order ahead from your phone. Pay cash or top up your Reto Wallet.",
  },
];

export default function WhyRetoSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.num}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 p-8 rounded-2xl border"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e" }}
          >
            <span className="font-bold tracking-widest text-sm" style={{ color: "#f59e0b" }}>
              {f.num}
            </span>
            <h3 className="text-2xl font-bold leading-tight" style={{ color: "#fef3c7" }}>
              {f.title}
            </h3>
            <p className="leading-relaxed" style={{ color: "#8a6a3a" }}>
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
