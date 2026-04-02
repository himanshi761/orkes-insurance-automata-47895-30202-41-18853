import { Link, useLocation } from "react-router-dom";
import { FileText, Folder, HelpCircle, LayoutDashboard, Receipt } from "lucide-react";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/customer" },
    { name: "My Claims", icon: FileText, path: "/customer" },
    { name: "Documents", icon: Folder, path: "/documents" },
    { name: "Help & Support", icon: HelpCircle, path: "/help" },
  ];

  const widthClass = collapsed ? "w-24" : "w-64";

  return (
    <aside
      className={`fixed inset-y-0 left-0 hidden border-r border-[#9b7305] bg-[linear-gradient(180deg,#c88f00_0%,#a37508_100%)] px-4 py-4 text-white lg:flex lg:flex-col ${widthClass}`}
    >
      <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-100">iClaim</p>
        {!collapsed && (
          <>
            <h2 className="mt-2 text-3xl font-bold leading-tight">Customer Portal</h2>
            <p className="mt-2 text-sm leading-6 text-yellow-50/90">
              Follow every claim update and keep your supporting documents close.
            </p>
          </>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 transition ${
                active ? "bg-[#805c05] shadow-lg" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-3xl border border-white/20 bg-slate-950/20 p-3.5">
        <p className="text-xs uppercase tracking-[0.24em] text-yellow-100">Claim Tracking</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-2">
            <Receipt className="h-5 w-5" />
          </div>
          {!collapsed && (
            <p className="text-xs leading-5 text-yellow-50/80">
              Review AI insights, documents, and claim progress in one place.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
