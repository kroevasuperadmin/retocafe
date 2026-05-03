"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete your account? This will remove your profile and wallet data and cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Unable to delete the account right now.");
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete the account right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: "#1a1108", borderColor: "#5c241f" }}>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold" style={{ color: "#fef3c7" }}>
          Delete account
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#a87a72" }}>
          This permanently removes your login and profile. Orders that already exist stay in the restaurant records.
        </p>
        {error && (
          <p className="text-sm" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="self-start rounded-full border px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{ borderColor: "#7f2d2a", color: "#fecaca", backgroundColor: "rgba(127,45,42,0.18)" }}
        >
          {loading ? "Deleting..." : "Delete account"}
        </button>
      </div>
    </div>
  );
}
