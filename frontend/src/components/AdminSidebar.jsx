import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Agents", icon: UserCheck, path: "/admin/agents" },
  { name: "Clients", icon: Users, path: "/admin/clients" },
  { name: "Claims", icon: FileText, path: "/admin/claims" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    
    <aside className="w-64 min-h-screen bg-[rgb(15,42,68)] border-r border-[#1b3947] sticky top-0 text-white">
      {/* Header */}
      <div className="p-6 border-b border-[#1b3947]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2f6177] flex items-center justify-center shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">
              Admin Portal
            </h2>
            <p className="text-xs text-gray-300">System Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#2f6177] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#2a566b] hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive && "drop-shadow-sm"
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
