const HelpSupport = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

      <div className="space-y-4">

        <div>
          <p className="font-semibold">How long does claim processing take?</p>
          <p className="text-gray-500">3–5 business days</p>
        </div>

        <div>
          <p className="font-semibold">What documents do I need?</p>
          <p className="text-gray-500">Proof + receipts</p>
        </div>

        <div>
          <p className="font-semibold">How do I track my claim?</p>
          <p className="text-gray-500">Go to My Claims</p>
        </div>

      </div>
    </div>
  );
};

export default HelpSupport;