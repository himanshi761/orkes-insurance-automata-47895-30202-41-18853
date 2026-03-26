import { Menu, User, Settings, LogOut } from "lucide-react";

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="flex justify-between items-center bg-[#0f2a44] text-white px-6 py-3 shadow">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}>
          <Menu />
        </button>

        <h1 className="text-xl font-bold text-yellow-400">
          iClaim
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        <User className="cursor-pointer hover:text-yellow-400" />
        <Settings className="cursor-pointer hover:text-yellow-400" />
        <LogOut className="cursor-pointer hover:text-red-400" />
      </div>
    </div>
  );
};

export default Topbar;