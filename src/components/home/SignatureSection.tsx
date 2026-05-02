"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SignatureSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "#241608" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase"
            style={{ color: "#f59e0b" }}
          >
            Our Signature
          </span>
          <h2
            className="font-bold leading-tight"
            style={{ color: "#fef3c7", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            The Shawarma<br />Done Right
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#8a6a3a" }}>
            Slow-marinated, stacked on a vertical spit, and carved to order. Every wrap is built with garlic sauce, pickles, and the kind of heat that hits properly.
          </p>
          <div>
            <Link
              href="/menu"
              className="inline-block font-semibold px-7 py-3 rounded-full border transition-all hover:bg-[#f59e0b] hover:border-[#f59e0b] hover:text-[#1a1108]"
              style={{ borderColor: "#f59e0b", color: "#f59e0b" }}
            >
              See Full Menu
            </Link>
          </div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[480px] rounded-2xl overflow-hidden"
          style={{ border: "1px solid #3d2a0e" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900&q=85"
            alt="Reto Cafe Signature Shawarma"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(26,17,8,0.5) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
