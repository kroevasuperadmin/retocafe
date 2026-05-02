import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function AdminWalletPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>Wallet Transactions</h1>
      <div className="flex flex-col gap-3">
        {transactions?.map((txn: { id: string; type: string; amount: number; description: string; created_at: string; profiles: { full_name: string } | null }) => (
          <div key={txn.id} className="rounded-xl p-4 border flex items-center gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
            <div
              className="p-2 rounded-full"
              style={txn.type === "topup" ? { backgroundColor: "rgba(34,197,94,0.2)", color: "#4ade80" } : { backgroundColor: "rgba(239,68,68,0.2)", color: "#f87171" }}
            >
              {txn.type === "topup" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#fef3c7" }}>{txn.profiles?.full_name ?? "Unknown"}</p>
              <p className="text-xs" style={{ color: "#8a6a3a" }}>{txn.description} · {formatDate(txn.created_at)}</p>
            </div>
            <span className="font-bold" style={txn.type === "topup" ? { color: "#4ade80" } : { color: "#f87171" }}>
              {txn.type === "topup" ? "+" : "-"}{formatPrice(txn.amount)}
            </span>
          </div>
        ))}
        {(!transactions || transactions.length === 0) && (
          <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
