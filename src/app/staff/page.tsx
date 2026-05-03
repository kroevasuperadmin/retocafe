"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CategoryTabs from "@/components/menu/CategoryTabs";
import { formatPrice } from "@/lib/utils";

export default function AdminOrderEntryPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState("");
  const { items: cartItems, total, clearCart } = useCart();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
        supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
      ]);
      setCategories(cats ?? []);
      setItems(menuItems ?? []);
    }
    load();
  }, [supabase]);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => {
          const cat = categories.find((c) => c.id === i.category_id);
          return cat?.slug === activeCategory;
        });

  async function submitOrder() {
    if (cartItems.length === 0) return;
    setLoading(true);
    setSent("");
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order } = await supabase
      .from("orders")
      .insert({
        staff_id: user?.id,
        table_number: tableNumber || null,
        status: "pending",
        payment_method: "cash",
        subtotal: total,
      })
      .select()
      .single();

    if (!order) {
      setLoading(false);
      return;
    }

    await supabase.from("order_items").insert(
      cartItems.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menu_item.id,
        name: i.menu_item.name,
        unit_price: i.menu_item.price,
        quantity: i.quantity,
      }))
    );

    clearCart();
    setTableNumber("");
    setLoading(false);
    setSent(`Order #${order.id.slice(0, 8).toUpperCase()} sent to POS!`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>Admin Order Entry</h1>
        <p className="text-sm mb-6" style={{ color: "#8a6a3a" }}>
          Use this on a phone when an admin needs to place an order. Every submission syncs straight to the cashier POS.
        </p>
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {filtered.map((item) => <MenuItemCard key={item.id} item={item} />)}
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="rounded-2xl p-6 border sticky top-20" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#d4a96a" }}>Current Order</h2>
          <input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
            className="w-full rounded-xl px-4 py-2 text-sm border mb-4 focus:outline-none"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" }}
          />
          <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map(({ menu_item, quantity }) => (
              <div key={menu_item.id} className="flex justify-between text-sm">
                <span style={{ color: "#fef3c7" }}>{menu_item.name} x{quantity}</span>
                <span style={{ color: "#d4a96a" }}>{formatPrice(menu_item.price * quantity)}</span>
              </div>
            ))}
            {cartItems.length === 0 && <p className="text-sm text-center py-4" style={{ color: "#8a6a3a" }}>No items yet</p>}
          </div>
          <div className="border-t pt-4 mb-4 flex justify-between font-bold" style={{ borderColor: "#3d2a0e" }}>
            <span style={{ color: "#d4a96a" }}>Total</span>
            <span style={{ color: "#f59e0b" }}>{formatPrice(total)}</span>
          </div>
          {sent && <p className="text-xs text-center mb-3" style={{ color: "#4ade80" }}>{sent}</p>}
          <button
            onClick={submitOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
          >
            {loading ? "Sending..." : "Send to POS"}
          </button>
        </div>
      </div>
    </div>
  );
}
