import POSBoard from "@/components/pos/POSBoard";

export default function POSPage() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#1a1108" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#fef3c7" }}>POS Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22c55e" }} />
            <span className="text-sm" style={{ color: "#8a6a3a" }}>Live</span>
          </div>
        </div>
        <POSBoard />
      </div>
    </div>
  );
}
