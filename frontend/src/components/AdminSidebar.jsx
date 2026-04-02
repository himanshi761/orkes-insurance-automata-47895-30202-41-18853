import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin", exact: true },
  { name: "Agents", icon: UserCheck, path: "/admin/agents" },
  { name: "Clients", icon: Users, path: "/admin/clients" },
  { name: "Claims", icon: FileText, path: "/admin/claims" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#9b7305] bg-[linear-gradient(180deg,#c88f00_0%,#a37508_100%)] px-4 py-4 text-white lg:flex lg:flex-col">
      <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#805c05] shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
            <p className="text-xs uppercase tracking-[0.24em] text-yellow-100">System Control</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#805c05] text-white shadow-md"
                  : "bg-white/10 text-yellow-50 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/20 bg-slate-950/20 p-3.5">
        <p className="text-xs uppercase tracking-[0.24em] text-yellow-100">Operations</p>
        <p className="mt-2 text-xs leading-5 text-yellow-50/80">
          Monitor claims, assignments, analytics, and payout completion from one workspace.
        </p>
      </div>
    </aside>
  );
};
