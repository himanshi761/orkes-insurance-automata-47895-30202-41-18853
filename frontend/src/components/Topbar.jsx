import { LogOut, Menu, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleMeta = {
  admin: {
    label: "Admin Workspace",
    subtitle: "System operations and control",
    settingsPath: "/admin/settings",
  },
  agent: {
    label: "Agent Workspace",
    subtitle: "Claim review and AI signals",
    settingsPath: "/help",
  },
  customer: {
    label: "Customer Workspace",
    subtitle: "Claims, documents, and tracking",
    settingsPath: "/help",
  },
};

const Topbar = ({ toggleSidebar, className = "" }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "customer";
  const meta = roleMeta[role] || roleMeta.customer;

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate(meta.settingsPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/auth");
  };

  return (
    <div
      className={`flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 text-slate-900 backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-3">
        {toggleSidebar && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-2xl bg-[#f1b903] p-2 text-slate-950 shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">iClaim</p>
          <p className="text-lg font-semibold">{meta.label}</p>
          <p className="text-xs text-slate-500">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleProfile}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          title="Profile"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </button>

        <button
          type="button"
          onClick={handleSettings}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
