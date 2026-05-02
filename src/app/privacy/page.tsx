export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#fef3c7" }}>Privacy Policy</h1>
      <div className="flex flex-col gap-4 leading-relaxed" style={{ color: "#8a6a3a" }}>
        <p>We collect your name, email, and phone number for account creation and order management.</p>
        <p>Your data is stored securely and never sold to third parties.</p>
        <p>Wallet transactions are recorded for your account history only.</p>
        <p>Contact us via the contact page for any data requests or deletion.</p>
      </div>
    </div>
  );
}
