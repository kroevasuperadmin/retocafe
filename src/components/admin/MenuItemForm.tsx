"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  }

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

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#d4a96a" }}
        >
          {uploading ? "Uploading..." : imageUrl ? "Replace Photo" : "Upload Photo"}
        </button>
        {imageUrl && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border" style={{ borderColor: "#3d2a0e" }}>
            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 text-xs px-2 py-1 rounded-lg font-medium"
              style={{ backgroundColor: "rgba(26,17,8,0.8)", color: "#f87171" }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm cursor-pointer" style={{ color: "#d4a96a" }}>
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="accent-amber-500" />
        Available for ordering
      </label>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium" style={{ backgroundColor: "#3d2a0e", color: "#d4a96a" }}>
          Cancel
        </button>
        <button type="submit" disabled={loading || uploading} className="flex-1 font-bold py-3 rounded-xl transition-all disabled:opacity-50" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
          {loading ? "Saving..." : item ? "Update" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
