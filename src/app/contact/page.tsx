export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#fef3c7" }}>Contact</h1>
      <div className="rounded-2xl border p-8 flex flex-col gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e", color: "#d4a96a" }}>
        <p>📍 <span className="ml-2">Shah Alam, Selangor, Malaysia</span></p>
        <p>🌐 <span className="ml-2">retocafe.com</span></p>
        <p>🕐 <span className="ml-2">Open daily — check with us for hours</span></p>
      </div>
    </div>
  );
}
