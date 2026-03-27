import { AdminSidebar } from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}