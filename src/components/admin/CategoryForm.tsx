"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory } from "@/lib/types";

interface Props {
  category?: MenuCategory;
  onClose: () => void;
}

export default function CategoryForm({ category, onClose }: Props) {
  const supabase = createClient();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 1);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!category) setSlug(toSlug(val));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) { setError("Name and slug are required."); return; }
    setSaving(true);
    setError("");

    const payload = { name: name.trim(), slug: slug.trim(), display_order: displayOrder, is_active: isActive };
    const { error: err } = category
      ? await supabase.from("menu_categories").update(payload).eq("id", category.id)
      : await supabase.from("menu_categories").insert(payload);

    setSaving(false);
    if (err) { setError(err.message); return; }
    onClose();
  }

  const inputStyle = {
    backgroundColor: "#1a1108",
    borderColor: "#3d2a0e",
    color: "#fef3c7",
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: "#8a6a3a" }}>Category Name</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Grills"
            className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none focus:border-[#f59e0b]"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: "#8a6a3a" }}>Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            placeholder="e.g. grills"
            className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none focus:border-[#f59e0b] font-mono"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1 font-medium" style={{ color: "#8a6a3a" }}>Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={1}
            className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none focus:border-[#f59e0b]"
            style={inputStyle}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setIsActive(!isActive)}
              className="w-10 h-6 rounded-full transition-colors relative cursor-pointer"
              style={{ backgroundColor: isActive ? "#f59e0b" : "#3d2a0e" }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full transition-transform"
                style={{ backgroundColor: "#1a1108", left: "4px", transform: isActive ? "translateX(16px)" : "translateX(0)" }}
              />
            </div>
            <span className="text-sm" style={{ color: "#d4a96a" }}>Active</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
          style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
        >
          {saving ? "Saving…" : category ? "Update Category" : "Add Category"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border transition-colors"
          style={{ borderColor: "#3d2a0e", color: "#8a6a3a" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
