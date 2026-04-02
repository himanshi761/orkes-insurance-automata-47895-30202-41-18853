const HelpSupport = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] p-6 lg:p-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-bold mb-4">Help & Support</h1>

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
    </div>
  );
};

export default HelpSupport;
