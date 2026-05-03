"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    num: "01",
    title: "Fire first, not reheated later",
    body: "Orders are built to feel alive when they reach the table. That means hot wraps, fresh rice, and the right textures instead of flat, parked food.",
  },
  {
    num: "02",
    title: "Comfort food with a proper rhythm",
    body: "There is a natural pace to the room: choose fast, eat well, keep moving. The layout should feel like a place people return to, not a static catalogue.",
  },
  {
    num: "03",
    title: "Built for nights, families, and repeat cravings",
    body: "The experience needs room for late-night grabs, family orders, and sit-down meals that feel a little more special than standard takeaway.",
  },
];

const callouts = [
  "Hot wraps",
  "Rice platters",
  "Fresh drinks",
  "Late-night comfort",
];

export default function WhyRetoSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-24"
        >
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: "#f59e0b" }}>
            The Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-[0.95] mb-6" style={{ color: "#fef3c7" }}>
            Built to feel like stepping into Shawarma Wonderland.
          </h2>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#d4a96a" }}>
            The homepage should feel like a place, not a form. Big food, strong pacing, and just enough motion to make the brand feel alive without becoming noisy.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
            {callouts.map((callout) => (
              <div
                key={callout}
                className="rounded-2xl border px-4 py-3"
                style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
              >
                <p className="text-sm font-semibold" style={{ color: "#fef3c7" }}>
                  {callout}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-5">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24, y: 18 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border p-7 md:p-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(36,22,8,0.96) 0%, rgba(26,17,8,0.98) 100%)",
                borderColor: "#3d2a0e",
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center border"
                  style={{ borderColor: "#3d2a0e", backgroundColor: "#1a1108", color: "#f59e0b" }}
                >
                  <span className="font-bold text-sm">{pillar.num}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3" style={{ color: "#fef3c7" }}>
                    {pillar.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "#8a6a3a" }}>
                    {pillar.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
