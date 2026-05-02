import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";

export default async function MenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2" style={{ color: "#fef3c7" }}>Menu</h1>
      <p className="mb-8" style={{ color: "#8a6a3a" }}>Everything we have on offer.</p>
      <MenuGrid categories={categories ?? []} items={items ?? []} />
    </div>
  );
}
