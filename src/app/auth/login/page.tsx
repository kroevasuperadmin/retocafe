"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }

      window.location.assign("/account");
    } catch {
      setError("Something went wrong while signing in.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none border";
  const inputStyle = { backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border p-8" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>Welcome back</h1>
        <p className="text-sm mb-8" style={{ color: "#8a6a3a" }}>Sign in to your account.</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={inputClass} style={inputStyle} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={inputClass} style={inputStyle} />
          {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
          <button type="submit" disabled={loading} className="font-bold py-3 rounded-full transition-all disabled:opacity-50" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center mt-6" style={{ color: "#8a6a3a" }}>
          No account?{" "}
          <Link href="/auth/register" style={{ color: "#f59e0b" }} className="hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
