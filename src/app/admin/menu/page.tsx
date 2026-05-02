"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | undefined>();
  const supabase = createClient();

  async function load() {
    const [{ data: cats }, { data: menuItems }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ]);
    setCategories(cats ?? []);
    setItems(menuItems ?? []);
  }

  useEffect(() => { load(); }, []);

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    load();
  }

  async function toggleAvailable(item: MenuItem) {
    await supabase.from("menu_items").update({ is_available: !item.is_available }).eq("id", item.id);
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#fef3c7" }}>Menu Management</h1>
        <button
          onClick={() => { setEditItem(undefined); setShowForm(true); }}
          className="flex items-center gap-2 font-bold px-5 py-2 rounded-full transition-all"
          style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#d4a96a" }}>{editItem ? "Edit Item" : "New Item"}</h2>
          <MenuItemForm
            categories={categories}
            item={editItem}
            onClose={() => { setShowForm(false); load(); }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl p-4 border flex items-center gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "#fef3c7" }}>{item.name}</p>
              <p className="text-sm" style={{ color: "#8a6a3a" }}>{categories.find((c) => c.id === item.category_id)?.name}</p>
            </div>
            <span className="font-bold" style={{ color: "#f59e0b" }}>{formatPrice(item.price)}</span>
            <button
              onClick={() => toggleAvailable(item)}
              className="text-xs px-2 py-1 rounded-full"
              style={item.is_available ? { backgroundColor: "rgba(34,197,94,0.2)", color: "#4ade80" } : { backgroundColor: "rgba(239,68,68,0.2)", color: "#f87171" }}
            >
              {item.is_available ? "Available" : "Hidden"}
            </button>
            <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-2 transition-colors" style={{ color: "#8a6a3a" }}>
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteItem(item.id)} className="p-2 transition-colors" style={{ color: "#ef4444" }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No menu items yet. Add your first item above.</p>}
      </div>
    </div>
  );
}
