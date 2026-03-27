import { useState } from "react";

const Settings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
        }}
      />

      {/* 🔥 Overlay (dark blur layer) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 🔥 Glass Card */}
      <div className="relative w-[400px] p-6 rounded-2xl bg-white/20 backdrop-blur-lg shadow-xl border border-white/30">

        <h2 className="text-white text-xl font-semibold mb-6">
          Settings
        </h2>

        {/* 🔹 Email Notifications */}
        <div className="flex justify-between items-center py-4 border-b border-white/20">
          <div>
            <p className="text-white font-medium">
              Email Notifications
            </p>
            <p className="text-white/70 text-sm">
              Send email alerts for new and updated claims
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setEmailNotif(!emailNotif)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              emailNotif ? "bg-teal-400" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                emailNotif ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* 🔹 Two Factor Auth */}
        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-white font-medium">
              Two-factor auth
            </p>
            <p className="text-white/70 text-sm">
              Require 2FA for agent and admin accounts
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              twoFA ? "bg-teal-400" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                twoFA ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;