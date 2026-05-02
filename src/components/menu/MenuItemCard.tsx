"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const { addItem } = useCart();

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all group cursor-default"
      style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3d2a0e")}
    >
      <div className="relative h-48 overflow-hidden" style={{ backgroundColor: "#3d2a0e" }}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌯</div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(26,17,8,0.75)" }}>
            <span className="text-sm font-medium" style={{ color: "#8a6a3a" }}>Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold" style={{ color: "#fef3c7" }}>{item.name}</h3>
        {item.description && (
          <p className="text-sm mt-1 line-clamp-2" style={{ color: "#8a6a3a" }}>{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold" style={{ color: "#f59e0b" }}>{formatPrice(item.price)}</span>
          <button
            onClick={() => item.is_available && addItem(item)}
            disabled={!item.is_available}
            className="rounded-full p-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
            onMouseEnter={(e) => { if (item.is_available) e.currentTarget.style.backgroundColor = "#d97706"; }}
            onMouseLeave={(e) => { if (item.is_available) e.currentTarget.style.backgroundColor = "#f59e0b"; }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
