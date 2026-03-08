import React from "react";
import { Outlet } from "react-router-dom";
import DashSideNavbar from "../../../components/User/DashSideNavbar";

const ProfileDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <DashSideNavbar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
