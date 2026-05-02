"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>Your cart is empty</h1>
        <p className="mb-8" style={{ color: "#8a6a3a" }}>Add something delicious from the menu.</p>
        <Link href="/menu" className="inline-block font-bold px-6 py-3 rounded-full transition-all hover:scale-105" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>Your Cart</h1>
      <div className="flex flex-col gap-4 mb-8">
        {items.map(({ menu_item, quantity }) => (
          <div key={menu_item.id} className="rounded-2xl p-4 border flex gap-4 items-center" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#3d2a0e" }}>
              {menu_item.image_url ? (
                <Image src={menu_item.image_url} alt={menu_item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🌯</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "#fef3c7" }}>{menu_item.name}</p>
              <p className="font-bold mt-1" style={{ color: "#f59e0b" }}>{formatPrice(menu_item.price)}</p>
            </div>
            <div className="flex items-center gap-2" style={{ color: "#d4a96a" }}>
              <button onClick={() => updateQuantity(menu_item.id, quantity - 1)} className="p-1 rounded-full transition-colors" style={{ backgroundColor: "#3d2a0e" }}>
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium" style={{ color: "#fef3c7" }}>{quantity}</span>
              <button onClick={() => updateQuantity(menu_item.id, quantity + 1)} className="p-1 rounded-full transition-colors" style={{ backgroundColor: "#3d2a0e" }}>
                <Plus size={14} />
              </button>
              <button onClick={() => removeItem(menu_item.id)} className="p-1 ml-2 transition-colors" style={{ color: "#ef4444" }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 border" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <div className="flex justify-between text-lg font-bold mb-6">
          <span style={{ color: "#d4a96a" }}>Total</span>
          <span style={{ color: "#f59e0b" }}>{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="block w-full font-bold py-4 rounded-full text-center transition-all hover:scale-[1.02]" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
