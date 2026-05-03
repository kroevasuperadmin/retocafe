"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        window.location.assign("/account");
        return;
      }

      setNotice("Check your email to finish creating your account.");
    } catch {
      setError("Something went wrong while creating the account.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none border";
  const inputStyle = { backgroundColor: "#1a1108", borderColor: "#3d2a0e", color: "#fef3c7" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border p-8" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>Create account</h1>
        <p className="text-sm mb-8" style={{ color: "#8a6a3a" }}>Create a Member account for order history and faster repeat checkout.</p>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required className={inputClass} style={inputStyle} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className={inputClass} style={inputStyle} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={inputClass} style={inputStyle} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" required minLength={6} className={inputClass} style={inputStyle} />
          {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
          {notice && <p className="text-sm" style={{ color: "#d4a96a" }}>{notice}</p>}
          <button type="submit" disabled={loading} className="font-bold py-3 rounded-full transition-all disabled:opacity-50" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-center mt-6" style={{ color: "#8a6a3a" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#f59e0b" }} className="hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
