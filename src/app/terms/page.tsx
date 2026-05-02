export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#fef3c7" }}>Terms of Service</h1>
      <div className="flex flex-col gap-4 leading-relaxed" style={{ color: "#8a6a3a" }}>
        <p>By using Reto Cafe&apos;s ordering system, you agree to provide accurate information when registering and placing orders.</p>
        <p>Wallet top-ups are non-refundable unless agreed upon by management.</p>
        <p>Orders placed are subject to item availability. We will contact you if an item becomes unavailable.</p>
        <p>Reto Cafe reserves the right to modify these terms at any time.</p>
      </div>
    </div>
  );
}
