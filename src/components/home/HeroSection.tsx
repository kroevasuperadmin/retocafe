"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { FEATURED_IMAGES } from "@/lib/featured-images";

const heroStats = [
  { label: "Fresh off the grill", value: "Made to order" },
  { label: "Late-night comfort", value: "Built for cravings" },
  { label: "Wonderland energy", value: "Shawarma, rice, drinks" },
];

const floatingTags = ["Fire", "Smoke", "Sauce", "Steam"];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section ref={ref} className="relative flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.06 }}>
        <Image
          src={FEATURED_IMAGES.hero}
          alt="Reto Cafe hero dish"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(245,158,11,0.16)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-8rem] right-[-4rem] h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(212,169,106,0.12)" }}
        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cinematic overlay — heavy at bottom, lighter at top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,17,8,0.45) 0%, rgba(26,17,8,0.55) 50%, rgba(26,17,8,0.92) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-semibold tracking-[0.3em] uppercase mb-5"
          style={{ color: "#f59e0b" }}
        >
          Welcome to
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6 backdrop-blur-xl"
          style={{ backgroundColor: "rgba(26,17,8,0.35)", borderColor: "rgba(61,42,14,0.9)" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
          <span className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: "#d4a96a" }}>
            Open late, served hot
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold leading-none mb-6"
          style={{ color: "#fef3c7", fontSize: "clamp(4rem, 14vw, 10rem)" }}
        >
          Reto Cafe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="text-sm md:text-base font-semibold uppercase tracking-[0.45em] mb-5"
          style={{ color: "#d4a96a" }}
        >
          Shawarma Wonderland
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto"
          style={{ color: "#d4a96a" }}
        >
          Authentic shawarma crafted with care. Order in, dine in, feel at home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <Link
            href="/#menu"
            className="inline-block font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
          >
            Explore Menu
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.95 } },
          }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {floatingTags.map((tag) => (
            <motion.span
              key={tag}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
              style={{
                backgroundColor: "rgba(26,17,8,0.4)",
                borderColor: "rgba(61,42,14,0.8)",
                color: "#fef3c7",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.9 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left"
        >
          {heroStats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border px-4 py-3 backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(26,17,8,0.45)",
                borderColor: "rgba(61,42,14,0.8)",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "#8a6a3a" }}>
                0{index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "#fef3c7" }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "#d4a96a" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "#8a6a3a" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
