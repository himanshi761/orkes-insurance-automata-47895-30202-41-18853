import { AdminSidebar } from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
      <Topbar className="sticky top-0 z-40" />
      <main className="min-h-screen">
        <div className="min-h-[calc(100vh-73px)] p-6">
          <Outlet />
        </div>
      </main>
      </div>
    </div>
  );
}
