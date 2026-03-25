import React, { useEffect, useState } from "react";
import SideNavbar from "./Components/SideNavbar";
import ExIphoneLogo from "../../components/ExIphoneLogo";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SmallDeviceNavbar from "./Components/SmallDeviceNavbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex lg:flex-row flex-col overflow-y-hidden h-screen bg-gray-50">
      <SmallDeviceNavbar />
      
      {/* Desktop Sidebar with Collapse Button Inside */}
      <div
        className={`hidden lg:flex flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo and Collapse Button - Same line when expanded, 2 lines when collapsed */}
        <div className={`flex items-center justify-between py-3 px-3 border-b border-gray-200 transition-all ${
          isCollapsed ? "flex-col gap-2" : "flex-row"
        }`}>
          <div className="flex items-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <ExIphoneLogo size={isCollapsed ? "h-16" : "h-20"} />
          </div>
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <SideNavbar isCollapsed={isCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
