import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ count: orderCount }, { count: userCount }, { data: doneOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("subtotal").eq("status", "done"),
  ]);

  const totalRevenue = doneOrders?.reduce((sum, o) => sum + o.subtotal, 0) ?? 0;

  const stats = [
    { label: "Total Orders", value: String(orderCount ?? 0) },
    { label: "Registered Users", value: String(userCount ?? 0) },
    { label: "Revenue (Done)", value: formatPrice(totalRevenue) },
  ];

  const links = [
    { href: "/admin/menu", label: "Menu Management" },
    { href: "/admin/orders", label: "All Orders" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/wallet", label: "Wallet Transactions" },
    { href: "/staff", label: "Admin Order Entry" },
    { href: "/pos", label: "Cashier POS Dashboard" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-6 border text-center" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
            <p className="text-3xl font-bold" style={{ color: "#f59e0b" }}>{s.value}</p>
            <p className="text-sm mt-1" style={{ color: "#8a6a3a" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-2xl p-5 border font-medium transition-all hover:border-[#f59e0b]/50" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#fef3c7" }}>
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
