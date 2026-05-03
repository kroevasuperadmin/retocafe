"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b" style={{ backgroundColor: "rgba(26,17,8,0.85)", borderColor: "#3d2a0e" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: "#f59e0b" }}>
          Reto Cafe
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#d4a96a" }}>
          <Link href="/" className="hover:text-[#fef3c7] transition-colors">Home</Link>
          <Link href="/menu" className="hover:text-[#fef3c7] transition-colors">Menu</Link>
          <Link href="/about" className="hover:text-[#fef3c7] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#fef3c7] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4" style={{ color: "#d4a96a" }}>
          <button onClick={() => setCartOpen(true)} className="relative p-2 hover:text-[#f59e0b] transition-colors">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#f59e0b", color: "#1a1108" }}>
                {count}
              </span>
            )}
          </button>
          <Link href="/account" className="p-2 hover:text-[#f59e0b] transition-colors">
            <User size={20} />
          </Link>
          {isLoggedIn && (
            <LogoutButton
              className="rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:border-[#f59e0b] hover:text-[#f59e0b]"
              style={{ borderColor: "#3d2a0e" }}
            />
          )}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#d4a96a" }}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/wallet" onClick={() => setMenuOpen(false)}>Wallet</Link>
          <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
          {isLoggedIn && (
            <LogoutButton
              className="text-left"
            />
          )}
        </div>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
