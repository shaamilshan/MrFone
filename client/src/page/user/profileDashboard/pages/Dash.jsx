import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard, Shield, Edit2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { URL } from "../../../../Common/api";
import { config } from "../../../../Common/configurations";
import Modal from "../../../../components/Modal";
import EditProfile from "../../components/EditProfile";

const Dash = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [orderCounts, setOrderCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const loadOrderCounts = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/order-count`, config);
      if (data) {
        setOrderCounts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/orders?limit=2`, config);
      if (data && data.orders) {
        setRecentOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadDefaultAddress = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/address`, config);
      if (data && data.addresses && data.addresses.length > 0) {
        setDefaultAddress(data.addresses[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderCounts();
    loadRecentOrders();
    loadDefaultAddress();
  }, []);

  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      pending: "bg-orange-100 text-orange-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      {showEditProfile && (
        <Modal tab={<EditProfile closeToggle={toggleEditProfile} />} />
      )}

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              My Account
            </h1>
            <button
              onClick={toggleEditProfile}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
          <p className="text-gray-500">
            Manage your profile, orders, and preferences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orderCounts.totalOrders || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">Total Orders</p>
                <p className="text-xs text-green-600 font-medium mt-2">
                  +2 since last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orderCounts.pendingOrders || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">Active Orders</p>
                <p className="text-xs text-orange-600 font-medium mt-2">
                  Out for delivery
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orderCounts.wishlistCount || 5}
                </p>
                <p className="text-sm text-gray-500 mt-1">Wishlist Items</p>
                <Link
                  to="/dashboard/wishlist"
                  className="text-xs text-blue-600 font-medium mt-2 inline-block hover:underline"
                >
                  View Wishlist
                </Link>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <button
                onClick={toggleEditProfile}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Full Name
                </p>
                <p className="text-gray-900 font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Email Address
                </p>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Member Since
                </p>
                <p className="text-gray-900">
                  {user?.createdAt ? formatDate(user.createdAt) : "October 2021"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                to="/dashboard/order-history"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all orders
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/order-history/detail/${order._id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      {order.products && order.products[0]?.product?.imageURL ? (
                        <img
                          src={`${URL}/img/${order.products[0].product.imageURL}`}
                          alt="Product"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            #{order.orderId || order._id?.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.products && order.products[0]?.product?.name}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 shrink-0 ml-4">
                          ₹{order.totalPrice?.toLocaleString()}.00
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-500">
                          Ordered {order.createdAt ? formatDate(order.createdAt) : "Oct 24, 2023"}
                        </p>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.toUpperCase() || "DELIVERED"}
                        </span>
                      </div>

                      {order.status?.toLowerCase() === "delivered" && (
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium mt-2">
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent orders</p>
                <Link
                  to="/collections"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Address & Payment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Address */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Default Address</h3>
                </div>
                <Link
                  to="/dashboard/addresses"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Manage
                </Link>
              </div>
            </div>

            <div className="p-6">
              {defaultAddress ? (
                <>
                  <p className="font-medium text-gray-900 mb-2">
                    {defaultAddress.name || `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {defaultAddress.street || "1 Infinite Loop"}
                    <br />
                    {defaultAddress.city || "Cupertino"}, {defaultAddress.state || "CA"}{" "}
                    {defaultAddress.zipCode || "95014"}
                    <br />
                    {defaultAddress.country || "United States"}
                  </p>
                  <button className="mt-4 text-sm font-medium text-gray-900 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                    Edit Address
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">No address added</p>
                  <Link
                    to="/dashboard/addresses"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Add Address
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Primary Payment */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Primary Payment</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-8 bg-white rounded"></div>
                  <p className="text-xs uppercase tracking-wider">Visa</p>
                </div>
                <p className="text-sm mb-2">Visa ending in 4242</p>
                <p className="text-xs opacity-75">Expires 12/26</p>
              </div>
              <button className="mt-4 w-full text-sm font-medium text-gray-900 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                Change Method
              </button>
            </div>
          </div>
        </div>

        {/* Security & Login */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Security & Login
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">
                  Last changed 3 months ago
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Change
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-green-600">
                  Enabled
                </span>
              </label>
            </div>

            {/* Recent Login Activity */}
            <div className="pt-6 border-t border-gray-200">
              <p className="font-medium text-gray-900 mb-4">
                Recent Login Activity
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      MacBook Pro - San Francisco, CA
                    </p>
                    <p className="text-xs text-gray-500">Yesterday at 2:15 PM</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    This Device
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      iPhone 15 Pro - San Francisco, CA
                    </p>
                    <p className="text-xs text-gray-500">Oct 26 at 8:30 AM</p>
                  </div>
                  <button className="text-xs text-red-600 font-medium hover:underline">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-gray-400">
            © 2024 Apple Reseller Inc. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dash;
