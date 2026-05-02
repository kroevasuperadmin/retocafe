import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-lg mb-2" style={{ color: "#f59e0b" }}>Reto Cafe</p>
          <p className="text-sm" style={{ color: "#8a6a3a" }}>Authentic shawarma and more, crafted with care.</p>
        </div>
        <div>
          <p className="font-semibold mb-3" style={{ color: "#d4a96a" }}>Quick Links</p>
          <div className="flex flex-col gap-2 text-sm" style={{ color: "#8a6a3a" }}>
            <Link href="/menu" className="hover:text-[#fef3c7] transition-colors">Menu</Link>
            <Link href="/about" className="hover:text-[#fef3c7] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#fef3c7] transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold mb-3" style={{ color: "#d4a96a" }}>Account</p>
          <div className="flex flex-col gap-2 text-sm" style={{ color: "#8a6a3a" }}>
            <Link href="/auth/login" className="hover:text-[#fef3c7] transition-colors">Login</Link>
            <Link href="/auth/register" className="hover:text-[#fef3c7] transition-colors">Register</Link>
            <Link href="/wallet" className="hover:text-[#fef3c7] transition-colors">Wallet</Link>
            <Link href="/privacy" className="hover:text-[#fef3c7] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#fef3c7] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t text-center py-4 text-xs" style={{ borderColor: "#3d2a0e", color: "#8a6a3a" }}>
        © {new Date().getFullYear()} Reto Cafe. All rights reserved.
      </div>
    </footer>
  );
}
