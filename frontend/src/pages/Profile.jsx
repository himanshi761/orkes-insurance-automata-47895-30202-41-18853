import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  User,
} from "lucide-react";

const roleConfig = {
  admin: {
    title: "Administrator Profile",
    subtitle: "Manage operations, assignments, and payout progress across the platform.",
    icon: Shield,
    accent: "from-amber-500 to-orange-500",
    dashboardLabel: "Go to Admin Dashboard",
    dashboardPath: "/admin",
    settingsPath: "/admin/settings",
  },
  agent: {
    title: "Agent Profile",
    subtitle: "Review assigned claims, use AI signals, and move verified claims to decision.",
    icon: Briefcase,
    accent: "from-sky-500 to-cyan-500",
    dashboardLabel: "Go to Agent Dashboard",
    dashboardPath: "/agent",
    settingsPath: "/help",
  },
  customer: {
    title: "Customer Profile",
    subtitle: "Track submitted claims, review updates, and manage your insurance journey.",
    icon: User,
    accent: "from-emerald-500 to-teal-500",
    dashboardLabel: "Go to Customer Dashboard",
    dashboardPath: "/customer",
    settingsPath: "/help",
  },
};

const DetailCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-slate-950 p-2 text-white">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
    <p className="mt-4 text-lg font-semibold text-slate-900">{value || "-"}</p>
  </div>
);

const ActionButton = ({ label, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition ${
      primary
        ? "bg-slate-950 text-white hover:bg-slate-800"
        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
    }`}
  >
    {label}
    <ChevronRight className="h-4 w-4" />
  </button>
);

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "customer";
  const name = localStorage.getItem("userName") || "User";
  const email = localStorage.getItem("userEmail") || "Not available";
  const userId = localStorage.getItem("userId") || "Not available";

  const config = useMemo(() => roleConfig[role] || roleConfig.customer, [role]);
  const Icon = config.icon;

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6 py-10 text-slate-900 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className={`bg-gradient-to-r ${config.accent} px-8 py-10 text-white`}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/75">Profile</p>
                  <h1 className="mt-2 text-4xl font-bold">{config.title}</h1>
                  <p className="mt-3 max-w-2xl text-white/85">{config.subtitle}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-sm text-white/75">Signed in as</p>
                <p className="mt-2 text-2xl font-semibold capitalize">{role}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="grid gap-5 md:grid-cols-2">
                <DetailCard icon={User} label="Full Name" value={name} />
                <DetailCard icon={Mail} label="Email" value={email} />
                <DetailCard icon={BadgeCheck} label="Role" value={role} />
                <DetailCard icon={Shield} label="User ID" value={userId} />
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-semibold">Quick Actions</h2>
                <p className="mt-2 text-slate-500">
                  Jump back into your workspace or open the right settings page for your role.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ActionButton
                    label={config.dashboardLabel}
                    primary
                    onClick={() => navigate(config.dashboardPath)}
                  />
                  <ActionButton
                    label="Open Settings"
                    onClick={() => navigate(config.settingsPath)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-950 p-2 text-white">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-semibold">Workspace Summary</h2>
                </div>
                <p className="mt-4 leading-7 text-slate-600">
                  This profile page is shared for customer, agent, and admin users so the topbar
                  profile action works consistently across the app.
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-950 p-2 text-white">
                    <Settings className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-semibold">Account Navigation</h2>
                </div>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>Profile button on the topbar opens this page.</li>
                  <li>Settings button routes you to the correct page for your role.</li>
                  <li>Logout clears the session and returns you to sign-in.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
