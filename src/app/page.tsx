import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";
import HeroSection from "@/components/home/HeroSection";
import WhyRetoSection from "@/components/home/WhyRetoSection";
import SignatureSection from "@/components/home/SignatureSection";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
  ]);

  return (
    <div>
      <HeroSection />
      <WhyRetoSection />
      <SignatureSection />

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#fef3c7" }}>Our Menu</h2>
        <p className="mb-8" style={{ color: "#8a6a3a" }}>Fresh, made-to-order, every time.</p>
        <MenuGrid categories={categories ?? []} items={items ?? []} />
      </section>
    </div>
  );
}
