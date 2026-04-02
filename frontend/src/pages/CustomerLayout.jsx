import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function CustomerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((value) => !value);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbfaf5_0%,#f3f6fb_100%)]">
      <Sidebar collapsed={collapsed} />

      <div className={`${collapsed ? "lg:pl-24" : "lg:pl-64"}`}>
        <Topbar toggleSidebar={toggleSidebar} className="sticky top-0 z-30" />
        <Outlet />
      </div>
    </div>
  );
}
