"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WalletTransaction } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);
      const [{ data: wallet }, { data: txns }] = await Promise.all([
        supabase.from("wallet_balances").select("balance").eq("user_id", user.id).single(),
        supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
      ]);
      setBalance(wallet?.balance ?? 0);
      setTransactions(txns ?? []);
    }
    load();
  }, [router, supabase]);

  async function handleTopup(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (!amount || amount <= 0 || !userId) return;
    setLoading(true);
    await supabase.rpc("topup_wallet", { p_user_id: userId, p_amount: amount });
    setBalance((b) => b + amount);
    setTransactions((prev) => [{
      id: crypto.randomUUID(), user_id: userId, amount, type: "topup",
      description: "Wallet top up", reference_id: null,
      created_at: new Date().toISOString(),
    }, ...prev]);
    setTopupAmount("");
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>My Wallet</h1>

      <div className="rounded-2xl p-8 border mb-8 text-center" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <p className="text-sm mb-2" style={{ color: "#8a6a3a" }}>Available Balance</p>
        <p className="text-5xl font-bold" style={{ color: "#f59e0b" }}>{formatPrice(balance)}</p>
      </div>

      <form onSubmit={handleTopup} className="rounded-2xl p-6 border mb-8" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <h2 className="font-semibold mb-4" style={{ color: "#d4a96a" }}>Top Up</h2>
        <div className="flex gap-3">
          <input
            type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)}
            placeholder="Amount (RM)" min="1" step="0.01"
            className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none border"
            style={{ backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" }}
          />
          <button type="submit" disabled={loading} className="font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
            {loading ? "..." : "Top Up"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4" style={{ color: "#fef3c7" }}>Transactions</h2>
      <div className="flex flex-col gap-3">
        {transactions.map((txn) => (
          <div key={txn.id} className="rounded-xl p-4 border flex items-center gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
            <div className="p-2 rounded-full" style={txn.type === "topup" ? { backgroundColor: "rgba(34,197,94,0.2)", color: "#4ade80" } : { backgroundColor: "rgba(239,68,68,0.2)", color: "#f87171" }}>
              {txn.type === "topup" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#fef3c7" }}>{txn.description}</p>
              <p className="text-xs" style={{ color: "#8a6a3a" }}>{formatDate(txn.created_at)}</p>
            </div>
            <span className="font-bold" style={txn.type === "topup" ? { color: "#4ade80" } : { color: "#f87171" }}>
              {txn.type === "topup" ? "+" : "-"}{formatPrice(txn.amount)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
