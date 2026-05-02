"use client";

import { Order, OrderItem, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "done",
  done: null,
};

interface Props {
  order: Order & { order_items: OrderItem[] };
}

export default function OrderCard({ order }: Props) {
  const supabase = createClient();

  async function advance() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await supabase.from("orders").update({ status: next }).eq("id", order.id);
  }

  const nextStatus = NEXT_STATUS[order.status];

  const borderColors: Record<OrderStatus, string> = {
    pending: "rgba(234,179,8,0.5)",
    preparing: "rgba(59,130,246,0.5)",
    ready: "rgba(34,197,94,0.5)",
    done: "#3d2a0e",
  };

  return (
    <div
      className="rounded-2xl p-5 border transition-all"
      style={{ backgroundColor: "#241608", borderColor: borderColors[order.status] }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold" style={{ color: "#fef3c7" }}>#{order.id.slice(0, 8).toUpperCase()}</p>
          {order.table_number && <p className="text-sm" style={{ color: "#8a6a3a" }}>{order.table_number}</p>}
          <p className="text-xs" style={{ color: "#8a6a3a" }}>{formatDate(order.created_at)}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span style={{ color: "#fef3c7" }}>{item.name} ×{item.quantity}</span>
            <span style={{ color: "#d4a96a" }}>{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-3" style={{ borderColor: "#3d2a0e" }}>
        <span className="font-bold" style={{ color: "#f59e0b" }}>{formatPrice(order.subtotal)}</span>
        <span className="text-xs capitalize" style={{ color: "#8a6a3a" }}>{order.payment_method}</span>
      </div>

      {nextStatus && (
        <button
          onClick={advance}
          className="w-full mt-3 font-bold py-2 rounded-xl text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
        >
          Mark as {ORDER_STATUS_LABELS[nextStatus]}
        </button>
      )}
    </div>
  );
}
