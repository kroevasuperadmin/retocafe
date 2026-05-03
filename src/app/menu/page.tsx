import { createClient } from "@/lib/supabase/server";
import MenuShowcase from "@/components/menu/MenuShowcase";

export default async function MenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*, category:menu_categories(*)").eq("is_available", true).order("display_order"),
  ]);

  return <MenuShowcase categories={categories ?? []} items={items ?? []} />;
}
