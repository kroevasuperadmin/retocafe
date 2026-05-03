"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const { menu_item, quantity } = item;

  return (
    <div className="flex items-center gap-3 py-3" style={{ borderColor: "#3d2a0e" }}>
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#3d2a0e" }}>
        {menu_item.image_url ? (
          <Image src={menu_item.image_url} alt={menu_item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug" style={{ color: "#fef3c7" }}>{menu_item.name}</p>
        <p className="text-xs font-bold mt-0.5" style={{ color: "#f59e0b" }}>{formatPrice(menu_item.price)}</p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => updateQuantity(menu_item.id, quantity - 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#3d2a0e", color: "#d4a96a" }}
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-medium" style={{ color: "#fef3c7" }}>{quantity}</span>
        <button
          onClick={() => updateQuantity(menu_item.id, quantity + 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#3d2a0e", color: "#d4a96a" }}
        >
          <Plus size={12} />
        </button>
        <button
          onClick={() => removeItem(menu_item.id)}
          className="w-8 h-8 flex items-center justify-center ml-1 transition-colors rounded-full hover:bg-white/5"
          style={{ color: "#ef4444" }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
