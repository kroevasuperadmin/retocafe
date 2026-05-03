export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#fef3c7" }}>Contact</h1>
      <div className="rounded-2xl border p-8 flex flex-col gap-5" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#d4a96a" }}>
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold" style={{ color: "#fef3c7" }}>Address</p>
            <p>112, Jalan Bukit Bintang, Bukit Bintang</p>
            <p>55100 Kuala Lumpur, Malaysia</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">🕐</span>
          <div>
            <p className="font-semibold" style={{ color: "#fef3c7" }}>Hours</p>
            <p>Shawarma Counter: 10am – 5am</p>
            <p>Cafe: 3pm – 3am</p>
            <p className="text-sm mt-1" style={{ color: "#8a6a3a" }}>Open daily</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">🌐</span>
          <div>
            <p className="font-semibold" style={{ color: "#fef3c7" }}>Website</p>
            <a href="https://retocafe.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#f59e0b" }}>retocafe.vercel.app</a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">🛵</span>
          <div>
            <p className="font-semibold" style={{ color: "#fef3c7" }}>Delivery</p>
            <p>Available on Grab</p>
          </div>
        </div>
      </div>
    </div>
  );
}
