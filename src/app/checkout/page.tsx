"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wallet">("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function placeOrder() {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user?.id ?? null,
        table_number: tableNumber || null,
        status: "pending",
        payment_method: paymentMethod,
        subtotal: total,
        wallet_deducted: paymentMethod === "wallet" ? total : 0,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      setError("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menu_item.id,
        name: i.menu_item.name,
        unit_price: i.menu_item.price,
        quantity: i.quantity,
        notes: i.notes || null,
      }))
    );

    if (paymentMethod === "wallet" && user) {
      const { error: walletError } = await supabase.rpc("deduct_wallet", {
        p_user_id: user.id,
        p_amount: total,
        p_reference_id: order.id,
      });
      if (walletError) {
        setError("Insufficient wallet balance.");
        await supabase.from("orders").delete().eq("id", order.id);
        setLoading(false);
        return;
      }
    }

    clearCart();
    router.push(`/order/${order.id}`);
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none border";
  const inputStyle = { backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>Checkout</h1>

      <div className="rounded-2xl p-6 border mb-6" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <h2 className="font-semibold mb-4" style={{ color: "#d4a96a" }}>Order Summary</h2>
        {items.map(({ menu_item, quantity }) => (
          <div key={menu_item.id} className="flex justify-between text-sm mb-2">
            <span style={{ color: "#fef3c7" }}>{menu_item.name} × {quantity}</span>
            <span style={{ color: "#d4a96a" }}>{formatPrice(menu_item.price * quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 flex justify-between font-bold" style={{ borderColor: "#3d2a0e" }}>
          <span style={{ color: "#d4a96a" }}>Total</span>
          <span style={{ color: "#f59e0b" }}>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="rounded-2xl p-6 border mb-6 flex flex-col gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <div>
          <label className="text-sm block mb-2" style={{ color: "#d4a96a" }}>Table Number (optional)</label>
          <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. Table 3" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm block mb-2" style={{ color: "#d4a96a" }}>Payment Method</label>
          <div className="flex gap-3">
            {(["cash", "wallet"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className="flex-1 py-3 rounded-xl border font-medium capitalize transition-all"
                style={
                  paymentMethod === method
                    ? { backgroundColor: "#f59e0b", color: "#1a1108", borderColor: "#f59e0b" }
                    : { backgroundColor: "#1a1108", color: "#d4a96a", borderColor: "#3d2a0e" }
                }
              >
                {method}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm block mb-2" style={{ color: "#d4a96a" }}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests..." rows={3} className={inputClass + " resize-none"} style={inputStyle} />
        </div>
      </div>

      {error && <p className="text-sm mb-4 text-center" style={{ color: "#ef4444" }}>{error}</p>}

      <button
        onClick={placeOrder}
        disabled={loading || items.length === 0}
        className="w-full font-bold py-4 rounded-full transition-all disabled:opacity-50"
        style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
