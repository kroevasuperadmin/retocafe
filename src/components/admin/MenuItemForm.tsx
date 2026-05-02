"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  categories: MenuCategory[];
  item?: MenuItem;
  onClose: () => void;
}

export default function MenuItemForm({ categories, item, onClose }: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: categoryId,
      image_url: imageUrl || null,
      is_available: isAvailable,
    };
    if (item) {
      await supabase.from("menu_items").update(payload).eq("id", item.id);
    } else {
      await supabase.from("menu_items").insert(payload);
    }
    setLoading(false);
    router.refresh();
    onClose();
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm border focus:outline-none";
  const inputStyle = { backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" };

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" required className={inputClass} style={inputStyle} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className={inputClass + " resize-none"} style={inputStyle} />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (RM)" required min="0" step="0.01" className={inputClass} style={inputStyle} />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass} style={{ ...inputStyle, backgroundColor: "#1a1108" }}>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className={inputClass} style={inputStyle} />
      <label className="flex items-center gap-3 text-sm cursor-pointer" style={{ color: "#d4a96a" }}>
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="accent-amber-500" />
        Available for ordering
      </label>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium" style={{ backgroundColor: "#3d2a0e", color: "#d4a96a" }}>
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 font-bold py-3 rounded-xl transition-all disabled:opacity-50" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
          {loading ? "Saving..." : item ? "Update" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
