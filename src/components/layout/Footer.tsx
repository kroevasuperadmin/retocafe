import Link from "next/link";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-lg mb-2" style={{ color: "#f59e0b" }}>Reto Cafe</p>
          <p className="text-sm mb-4" style={{ color: "#8a6a3a" }}>Authentic shawarma and more, crafted with care.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/retobukitbintang/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#fef3c7]" style={{ color: "#8a6a3a" }}>
              <InstagramIcon size={20} />
            </a>
            <a href="https://www.facebook.com/p/Reto-Bukit-Bintang-61553251319068/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#fef3c7]" style={{ color: "#8a6a3a" }}>
              <FacebookIcon size={20} />
            </a>
            <a href="https://www.tiktok.com/@retobukitbintang" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="transition-colors hover:text-[#fef3c7]" style={{ color: "#8a6a3a" }}>
              <TikTokIcon size={20} />
            </a>
          </div>
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
