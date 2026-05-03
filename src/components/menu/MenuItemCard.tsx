"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-[1.5rem] overflow-hidden border group cursor-default h-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(36,22,8,0.98) 0%, rgba(26,17,8,1) 100%)",
        borderColor: "#3d2a0e",
      }}
    >
      <div className="relative h-56 overflow-hidden" style={{ backgroundColor: "#3d2a0e" }}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1 text-center px-4"
            style={{ background: "linear-gradient(180deg, #3d2a0e 0%, #241608 100%)" }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#f59e0b" }}>
              Reto Cafe
            </span>
            <span className="text-sm" style={{ color: "#fef3c7" }}>
              Photo pending
            </span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,17,8,0.88) 0%, rgba(26,17,8,0.16) 48%, transparent 100%)",
          }}
        />
        {item.category?.name && (
          <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ backgroundColor: "rgba(26,17,8,0.65)", color: "#fef3c7", border: "1px solid rgba(61,42,14,0.9)" }}>
            {item.category.name}
          </div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(26,17,8,0.75)" }}>
            <span className="text-sm font-medium" style={{ color: "#8a6a3a" }}>Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold leading-tight" style={{ color: "#fef3c7" }}>{item.name}</h3>
        {item.description && (
          <p className="text-sm mt-2 line-clamp-3" style={{ color: "#8a6a3a" }}>{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: "#3d2a0e" }}>
          <span className="text-lg font-bold" style={{ color: "#f59e0b" }}>{formatPrice(item.price)}</span>
          <button
            onClick={() => item.is_available && addItem(item)}
            disabled={!item.is_available}
            className="rounded-full px-4 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
            onMouseEnter={(e) => { if (item.is_available) e.currentTarget.style.backgroundColor = "#d97706"; }}
            onMouseLeave={(e) => { if (item.is_available) e.currentTarget.style.backgroundColor = "#f59e0b"; }}
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={16} />
              Add
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
