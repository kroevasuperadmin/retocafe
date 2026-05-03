"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "@/lib/types";
import OrderCard from "./OrderCard";

type FullOrder = Order & { order_items: OrderItem[] };

export default function POSBoard() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [supabase] = useState(() => createClient());

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: true });
    setOrders((data as FullOrder[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchOrders();
    }, 0);

    const channel = supabase
      .channel("pos-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      window.clearTimeout(id);
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, supabase]);

  const cols = [
    { label: "Pending", key: "pending", color: "#eab308" },
    { label: "Preparing", key: "preparing", color: "#3b82f6" },
    { label: "Ready", key: "ready", color: "#22c55e" },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-6">
      {cols.map(({ label, key, color }) => {
        const colOrders = orders.filter((o) => o.status === key);
        return (
          <div key={key}>
            <h2 className="font-bold text-lg mb-4" style={{ color }}>
              {label}{" "}
              <span className="font-normal text-sm" style={{ color: "#8a6a3a" }}>({colOrders.length})</span>
            </h2>
            <div className="flex flex-col gap-4">
              {colOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {colOrders.length === 0 && (
                <div className="rounded-2xl border p-6 text-sm text-center" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#8a6a3a" }}>
                  No orders
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
