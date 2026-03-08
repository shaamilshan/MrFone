import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, User, Calendar, CheckCircle, XCircle, Edit2, Camera } from "lucide-react";
import Modal from "../../components/Modal";
import EditProfile from "./components/EditProfile";
import { getPassedDateOnwardDateForInput } from "../../Common/functions";
import ProfileImage from "../../components/ProfileImage";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Account Details
              </h1>
              <p className="text-gray-500 mt-2">
                Manage your personal information and preferences.
              </p>
            </div>
            <button
              onClick={toggleEditProfile}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Picture
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <ProfileImage user={user} />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                JPG, GIF or PNG. Max size of 2MB
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Upload Photo
                </button>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {user?.firstName || "-"}
                  </p>
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {user?.lastName || "-"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">{user?.email || "-"}</p>
                    {user?.isEmailVerified ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                        <XCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900 font-medium">
                    {user?.phoneNumber || "-"}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg max-w-md">
                  <p className="text-gray-900 font-medium">
                    {user?.dateOfBirth ? formatDate(user.dateOfBirth) : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Account Status
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Verification Status */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Email Verification
                    </h3>
                  </div>
                  {user?.isEmailVerified ? (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      <XCircle className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {user?.isEmailVerified
                    ? "Your email address has been verified."
                    : "Please verify your email address to secure your account."}
                </p>
                {!user?.isEmailVerified && (
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Resend Verification Email
                  </button>
                )}
              </div>

              {/* Account Created */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Member Since</h3>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  You joined on{" "}
                  <span className="font-medium text-gray-900">
                    {user?.createdAt ? formatDate(user.createdAt) : "October 2021"}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Thank you for being a valued customer!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Communication Preferences
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            {/* Newsletter */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Newsletter</p>
                <p className="text-sm text-gray-500">
                  Receive updates about new products and exclusive offers
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            {/* Order Updates */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-500">
                  Get notifications about your order status and delivery
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            {/* Promotions */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Promotional Emails</p>
                <p className="text-sm text-gray-500">
                  Receive special deals and promotional content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive text messages for important account updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={toggleEditProfile}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Edit Profile Information
            </button>
            <button className="px-6 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200">
          <div className="p-6 border-b border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500 max-w-xl">
                  Once you delete your account, there is no going back. Please be
                  certain. All your data including orders, addresses, and
                  preferences will be permanently removed.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shrink-0 ml-4">
                Delete Account
              </button>
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

export default ProfilePage;
