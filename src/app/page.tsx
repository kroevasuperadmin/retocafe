import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";
import HeroSection from "@/components/home/HeroSection";
import WhyRetoSection from "@/components/home/WhyRetoSection";
import SignatureSection from "@/components/home/SignatureSection";
import AccessModesSection from "@/components/home/AccessModesSection";

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
      <AccessModesSection />
      <SignatureSection />

      {/* Menu Section */}
      <section id="menu" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#fef3c7" }}>Our Menu</h2>
        <p className="mb-8" style={{ color: "#8a6a3a" }}>Fresh, made-to-order, every time.</p>
        <MenuGrid categories={categories ?? []} items={items ?? []} />
      </section>
    </div>
  );
}
