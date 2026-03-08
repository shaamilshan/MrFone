import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { X, User, Mail, Phone, Calendar, Upload, Trash2, CheckCircle, Loader } from "lucide-react";
import { editUserProfile } from "../../../redux/actions/userActions";
import { URL } from "../../../Common/api";
import { appJson } from "../../../Common/configurations";
import toast from "react-hot-toast";
import { getPassedDateOnwardDateForInput } from "../../../Common/functions";
import { commonRequest } from "../../../Common/api";
import EditProfileOTPComponent from "./EditProfileOTPComponent";

const EditProfile = ({ closeToggle }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // If user changes email there should be OTP validation
  const [emailChanged, setEmailChanged] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [otp, setOTP] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: getPassedDateOnwardDateForInput(user.dateOfBirth) || "",
    profileImgURL: user.profileImgURL || user.profileImageURL || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number"),
    dateOfBirth: Yup.date(),
  });

  const handleSubmit = async (value) => {
    if (user.email !== value.email) {
      if (!isOTPVerified) {
        setEmailChanged(true);
        setNewEmail(value.email);
        const data = await commonRequest(
          "POST",
          "/auth/send-otp",
          { email: value.email },
          appJson
        );

        if (data.success) {
          toast.success("OTP Sent successfully");
        } else {
          toast.error(data.response.data.error);
        }
      } else {
        const formData = new FormData();
        formData.append("firstName", value.firstName);
        formData.append("lastName", value.lastName);
        formData.append("phoneNumber", value.phoneNumber);
        formData.append("dateOfBirth", value.dateOfBirth);
        formData.append("email", value.email);
        formData.append("profileImgURL", value.profileImgURL || "");

        dispatch(editUserProfile(formData));
        closeToggle();
      }
    } else {
      const formData = new FormData();
      formData.append("firstName", value.firstName);
      formData.append("lastName", value.lastName);
      formData.append("phoneNumber", value.phoneNumber);
      formData.append("dateOfBirth", value.dateOfBirth);
      formData.append("email", value.email);
      formData.append("profileImgURL", value.profileImgURL || "");

      dispatch(editUserProfile(formData));
      closeToggle();
    }
  };

  const verifyOTP = async () => {
    const data = await commonRequest(
      "POST",
      "/auth/validate-otp",
      { email: newEmail, otp: parseInt(otp) },
      appJson
    );

    if (data) {
      if (data.success) {
        setIsOTPVerified(true);
        toast.success("OTP Verified");
        return;
      } else {
        toast.error(data.response.data.message);
      }
    } else {
      toast.error(data.error);
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("profileImgURL", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
          <p className="text-sm text-gray-300 mt-1">Update your personal information</p>
        </div>
        <button
          onClick={closeToggle}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : values.profileImgURL && typeof values.profileImgURL === "string" ? (
                      <img
                        src={
                          values.profileImgURL.startsWith("https")
                            ? values.profileImgURL
                            : `${URL}/img/${values.profileImgURL}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                  <div className="flex gap-2">
                    <label className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                      />
                    </label>
                    {(values.profileImgURL || previewImage) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("profileImgURL", "");
                          setPreviewImage(null);
                        }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  <ErrorMessage
                    name="profileImgURL"
                    component="p"
                    className="text-xs text-red-600 mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    <User className="w-4 h-4" />
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.firstName && touched.firstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    <User className="w-4 h-4" />
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.lastName && touched.lastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.email && touched.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  <Field
                    name="dateOfBirth"
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all max-w-md ${
                      errors.dateOfBirth && touched.dateOfBirth
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="p"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* OTP Verification Section */}
            {emailChanged && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Verification Required</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We've sent a verification code to <span className="font-medium">{newEmail}</span>
                    </p>
                  </div>
                </div>
                <EditProfileOTPComponent
                  otp={otp}
                  isOTPVerified={isOTPVerified}
                  setOTP={setOTP}
                  verifyOTP={verifyOTP}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeToggle}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
