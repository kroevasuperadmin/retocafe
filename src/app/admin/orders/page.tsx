import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>All Orders</h1>
      <div className="flex flex-col gap-3">
        {orders?.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="rounded-xl p-4 border flex items-center gap-4 transition-all hover:border-[#f59e0b]/50"
            style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}
          >
            <div className="flex-1">
              <p className="font-medium" style={{ color: "#fef3c7" }}>#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm" style={{ color: "#8a6a3a" }}>{formatDate(order.created_at)}</p>
            </div>
            {order.table_number && <span className="text-sm" style={{ color: "#8a6a3a" }}>{order.table_number}</span>}
            <span className="font-bold" style={{ color: "#f59e0b" }}>{formatPrice(order.subtotal)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </Link>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No orders yet.</p>
        )}
      </div>
    </div>
  );
}
