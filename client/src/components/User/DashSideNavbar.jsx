import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react";
import { logout } from "../../redux/actions/userActions";

const DashSideNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard/", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "order-history", icon: Package, label: "Orders" },
    { to: "wishlist", icon: Heart, label: "Wishlist" },
    { to: "addresses", icon: MapPin, label: "Addresses" },
    { to: "profile", icon: User, label: "Account Details" },
  ];

  return (
    <div className="w-full sm:w-64 bg-white rounded-lg shadow-sm shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
          Account
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Security Section */}
      <div className="mt-4 border-t border-gray-200">
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 px-2">
            Security
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashSideNavbar;
