"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: Props) {
  const { items, total } = useCart();
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%", opacity: 0.98 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.98 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-auto z-50 flex h-[92vh] w-full flex-col border-t sm:top-0 sm:right-0 sm:bottom-auto sm:left-auto sm:h-full sm:w-full sm:max-w-md sm:border-t-0 sm:border-l sm:rounded-none sm:rounded-l-3xl overflow-hidden"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b sm:px-6" style={{ borderColor: "#3d2a0e" }}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} style={{ color: "#f59e0b" }} />
                <span className="font-bold" style={{ color: "#fef3c7" }}>Your Cart</span>
                {itemCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3d2a0e", color: "#f59e0b" }}>
                    {itemCount} items
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-white/5"
                style={{ color: "#8a6a3a" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingCart size={42} style={{ color: "#f59e0b" }} />
                  <p className="text-sm" style={{ color: "#8a6a3a" }}>Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-sm font-semibold mt-1 underline underline-offset-2"
                    style={{ color: "#f59e0b" }}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#3d2a0e" }}>
                  {items.map((item) => (
                    <CartItem key={item.menu_item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t px-5 py-5 sm:px-6" style={{ borderColor: "#3d2a0e" }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold" style={{ color: "#d4a96a" }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: "#f59e0b" }}>{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center font-bold py-3 rounded-full transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
                >
                  Checkout now
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#241608", color: "#d4a96a" }}
                >
                  View full cart
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
