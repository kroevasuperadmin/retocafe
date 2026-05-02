import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { notFound } from "next/navigation";

const STATUS_STEPS = ["pending", "preparing", "ready", "done"];

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#fef3c7" }}>Order Placed</h1>
      <p className="mb-8 text-sm" style={{ color: "#8a6a3a" }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>

      {/* Progress bar */}
      <div className="flex items-center mb-6">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={
                i <= stepIndex
                  ? { backgroundColor: "#f59e0b", color: "#1a1108" }
                  : { backgroundColor: "#3d2a0e", color: "#8a6a3a" }
              }
            >
              {i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className="flex-1 h-1 mx-1" style={{ backgroundColor: i < stepIndex ? "#f59e0b" : "#3d2a0e" }} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="rounded-2xl p-6 border mb-6" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <h2 className="font-semibold mb-4" style={{ color: "#d4a96a" }}>Items</h2>
        {order.order_items?.map((item: { id: string; name: string; quantity: number; unit_price: number }) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span style={{ color: "#fef3c7" }}>{item.name} × {item.quantity}</span>
            <span style={{ color: "#d4a96a" }}>{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 flex justify-between font-bold" style={{ borderColor: "#3d2a0e" }}>
          <span style={{ color: "#d4a96a" }}>Total</span>
          <span style={{ color: "#f59e0b" }}>{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <div className="rounded-2xl p-6 border text-sm" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#8a6a3a" }}>
        <div className="flex justify-between mb-2">
          <span>Payment</span>
          <span className="capitalize" style={{ color: "#d4a96a" }}>{order.payment_method}</span>
        </div>
        {order.table_number && (
          <div className="flex justify-between mb-2">
            <span>Table</span>
            <span style={{ color: "#d4a96a" }}>{order.table_number}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Placed</span>
          <span style={{ color: "#d4a96a" }}>{formatDate(order.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
