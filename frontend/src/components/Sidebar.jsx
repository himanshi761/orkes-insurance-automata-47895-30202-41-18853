import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Folder, HelpCircle } from "lucide-react";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/customer" },
    { name: "My Claims", icon: FileText, path: "/customer" },
    { name: "Documents", icon: Folder, path: "/documents" },
    { name: "Help & Support", icon: HelpCircle, path: "/help" },
  ];

  return (
    <div
      className={`bg-[rgb(15,42,68)] text-white h-screen p-4 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <h2 className="text-xl font-bold mb-6 text-yellow-400">
        {!collapsed && "Customer Portal"}
      </h2>

      <div className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active ? "bg-yellow-500 text-black" : "hover:bg-yellow-600"
              }`}
            >
              <Icon size={20} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;