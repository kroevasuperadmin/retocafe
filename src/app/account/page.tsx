import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: orders }, { data: wallet }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("orders").select("*, order_items(*)").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("wallet_balances").select("balance").eq("user_id", user.id).single(),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>My Account</h1>

      <div className="rounded-2xl p-6 border mb-6 flex items-center justify-between" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <div>
          <p className="font-semibold text-lg" style={{ color: "#fef3c7" }}>{profile?.full_name}</p>
          <p className="text-sm" style={{ color: "#8a6a3a" }}>{user.email}</p>
          {profile?.phone && <p className="text-sm" style={{ color: "#8a6a3a" }}>{profile.phone}</p>}
        </div>
        <div className="flex flex-col gap-3 items-end">
          <Link href="/wallet" className="border px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "#f59e0b" }}>
            Wallet: {formatPrice(wallet?.balance ?? 0)}
          </Link>
          <LogoutButton className="text-sm font-medium rounded-xl border px-4 py-2 transition-all hover:border-[#f59e0b] hover:text-[#f59e0b]" />
        </div>
      </div>

      {profile?.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/admin"
            className="rounded-2xl border px-5 py-4 transition-all hover:border-[#f59e0b]"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#f59e0b" }}>
              Restaurant Ops
            </p>
            <p className="mt-2 text-lg font-semibold" style={{ color: "#fef3c7" }}>
              Open admin dashboard
            </p>
            <p className="mt-1 text-sm" style={{ color: "#8a6a3a" }}>
              Manage menu, orders, users, and wallet activity.
            </p>
          </Link>
          <Link
            href="/pos"
            className="rounded-2xl border px-5 py-4 transition-all hover:border-[#f59e0b]"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#f59e0b" }}>
              Cashier View
            </p>
            <p className="mt-2 text-lg font-semibold" style={{ color: "#fef3c7" }}>
              Open POS
            </p>
            <p className="mt-1 text-sm" style={{ color: "#8a6a3a" }}>
              Live order board for admin checkout and kitchen flow.
            </p>
          </Link>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4" style={{ color: "#fef3c7" }}>Order History</h2>
      <div className="flex flex-col gap-4">
        {orders?.map((order) => (
          <Link key={order.id} href={`/order/${order.id}`} className="rounded-2xl p-5 border block transition-all" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
            onMouseEnter={undefined}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium" style={{ color: "#fef3c7" }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm" style={{ color: "#8a6a3a" }}>{formatDate(order.created_at)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="font-bold" style={{ color: "#f59e0b" }}>{formatPrice(order.subtotal)}</p>
          </Link>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No orders yet.</p>
        )}
      </div>

      <div className="mt-10">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
