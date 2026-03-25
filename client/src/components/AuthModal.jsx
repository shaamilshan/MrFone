import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signUpUser } from "../redux/actions/userActions";
import { updateError } from "../redux/reducers/userSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, X, Check } from "lucide-react";

// Background images used in the original pages
import LoginImg from "../assets/login.jpg";
import SignUpBG from "../assets/register.jpg";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);

  // Close modal when user is successfully authenticated
  useEffect(() => {
    if (user && user.isEmailVerified !== undefined) {
      if (user.isEmailVerified || isLogin) {
         onClose();
      } else {
         // Optionally handle redirect to OTP here
         onClose();
      }
    }
  }, [user, onClose, isLogin]);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === "login");
      dispatch(updateError(""));
    }
  }, [isOpen, initialMode, dispatch]);

  if (!isOpen) return null;

  // --- LOGIN LOGIC ---
  const loginInitialValues = { email: "", password: "" };
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Email is not valid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleLoginSubmit = (values) => {
    dispatch(loginUser(values));
  };

  // --- REGISTER LOGIC ---
  const registerInitialValues = {
    firstName: "", lastName: "", email: "", 
    password: "", phoneNumber: ""
  };
  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Character"
      ),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number"),
  });
  const handleRegisterSubmit = (values) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phoneNumber", values.phoneNumber);
    dispatch(signUpUser(formData));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-colors text-gray-800 shadow-sm"
        >
          <X size={20} />
        </button>

        {/* LEFT COMPONENT (Background Only) */}
        <div className="hidden md:flex md:w-[45%] lg:w-[45%] relative bg-slate-200 overflow-hidden">
          <img 
            src={isLogin ? LoginImg : SignUpBG} 
            alt="Auth Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* RIGHT COMPONENT (Auth Form) */}
        <div className="w-full md:w-[55%] lg:w-[55%] p-8 sm:p-12 overflow-y-auto bg-white">
          {isLogin ? (
            /* --- LOGIN FORM --- */
            <div className="h-full flex flex-col justify-center max-w-[380px] mx-auto">
              <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">Sign in</h1>
              <p className="text-gray-500 mb-8 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={() => { setIsLogin(false); dispatch(updateError("")); }}
                  className="text-black font-bold hover:underline transition-all"
                >
                  Join here
                </button>
              </p>

              <Formik initialValues={loginInitialValues} validationSchema={loginSchema} onSubmit={handleLoginSubmit}>
                {({ errors, touched }) => (
                  <Form className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                      />
                      {errors.email && touched.email && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.email}</p>}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                         <label className="block text-sm font-bold text-gray-900">Password</label>
                         <button type="button" onClick={() => { onClose(); window.location.href = '/forgot-password'; }} className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Forgot Password?</button>
                      </div>
                      <div className="relative">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && touched.password && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.password}</p>}
                    </div>

                    {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 mt-6 bg-black text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {loading ? "Signing in..." : "Continue"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            /* --- REGISTER FORM --- */
            <div className="h-full flex flex-col justify-center max-w-[400px] mx-auto py-4">
              <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">Create an account</h1>
              <p className="text-gray-500 mb-8 text-sm">
                Already have an account?{" "}
                <button 
                  onClick={() => { setIsLogin(true); dispatch(updateError("")); }}
                  className="text-black font-bold hover:underline transition-all"
                >
                  Sign in here
                </button>
              </p>

              <Formik initialValues={registerInitialValues} validationSchema={registerSchema} onSubmit={handleRegisterSubmit}>
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-900 mb-1.5">First Name</label>
                        <Field name="firstName" placeholder="John" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400" />
                        {errors.firstName && touched.firstName && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Last Name</label>
                        <Field name="lastName" placeholder="Doe" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400" />
                        {errors.lastName && touched.lastName && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Email</label>
                      <Field name="email" type="email" placeholder="name@example.com" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400" />
                      {errors.email && touched.email && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Phone Number</label>
                      <Field name="phoneNumber" type="tel" placeholder="+1 (555) 000-0000" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400" />
                      {errors.phoneNumber && touched.phoneNumber && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[13px] font-bold text-gray-900">Password</label>
                      </div>
                      <div className="relative">
                        <Field 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full h-11 pl-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && touched.password && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.password}</p>}
                    </div>

                    {error && <div className="bg-red-50 text-red-600 text-[13px] p-3 rounded-lg border border-red-100 mt-2">{error}</div>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 mt-6 bg-black text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {loading ? "Creating account..." : "Join Now"}
                    </button>
                    
                    <p className="text-[12px] text-gray-400 text-center font-medium mt-4">
                      By joining, you agree to our Terms of Service & Privacy Policy.
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
