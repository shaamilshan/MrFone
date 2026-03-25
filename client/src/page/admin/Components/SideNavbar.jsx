import React from "react";
import ExIphoneLogo from "../../../components/ExIphoneLogo";
import { NavLink, useNavigate } from "react-router-dom";

import { RiDashboardLine } from "react-icons/ri";
import { FiBox, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { HiOutlineTicket } from "react-icons/hi";
import { BsCardChecklist, BsCreditCard } from "react-icons/bs";
import { AiOutlineTags } from "react-icons/ai";
import { FaUsersCog, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/userActions";
import { clearUserState } from "@/redux/reducers/userSlice";

const SideNavbar = ({ isCollapsed = false }) => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin/", icon: <RiDashboardLine /> },
    { label: "Products", path: "products", icon: <FiBox /> },
    { label: "Category", path: "categories", icon: <ImStack /> },
    { label: "Orders", path: "orders", icon: <BsCardChecklist /> },
    { label: "Payments", path: "payments", icon: <BsCreditCard /> },
  ];

  const userManagementItems = [
    ...(user && user.role === "superAdmin"
      ? [{ label: "Manage Admins", path: "manageAdmins", icon: <FaUsersCog /> }]
      : []),
    { label: "Managers", path: "managers", icon: <FaUsers /> },
    { label: "Customers", path: "customers", icon: <FaUsers /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {/* Main Menu */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
            {isCollapsed ? "" : "Menu"}
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Management */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
            {isCollapsed ? "" : "User Management"}
          </p>
          <nav className="space-y-1">
            {userManagementItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="text-lg flex-shrink-0">
            <FiLogOut />
          </span>
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
