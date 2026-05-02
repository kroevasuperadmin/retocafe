"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section ref={ref} className="relative flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>
      {/* Parallax background */}
      <motion.div
        style={{
          y: bgY,
          backgroundImage: "url('https://images.unsplash.com/photo-1756362847925-71c792d6729c?w=1800&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          inset: "-20% 0",
        }}
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
            href="/menu"
            className="inline-block font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
          >
            Explore Menu
          </Link>
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
