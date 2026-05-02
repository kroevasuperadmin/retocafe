import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(26,17,8,0.3), rgba(26,17,8,0.6), #1a1108)" }} />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundColor: "#241608" }}
        />
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "#f59e0b" }}>
            Welcome to
          </p>
          <h1 className="text-7xl md:text-9xl font-bold leading-none mb-6" style={{ color: "#fef3c7" }}>
            Reto Cafe
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto" style={{ color: "#d4a96a" }}>
            Authentic shawarma crafted with care. Order in, dine in, feel at home.
          </p>
          <Link
            href="/menu"
            className="inline-block font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105"
            style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
            onMouseEnter={undefined}
          >
            Explore Menu
          </Link>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#fef3c7" }}>Our Menu</h2>
        <p className="mb-8" style={{ color: "#8a6a3a" }}>Fresh, made-to-order, every time.</p>
        <MenuGrid categories={categories ?? []} items={items ?? []} />
      </section>
    </div>
  );
}
