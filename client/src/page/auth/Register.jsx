import React, { useEffect, useState } from "react";
import SignUpBG from "../../assets/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../redux/actions/userActions";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputWithIcon from "../../components/InputWithIcon";
import PasswordInputWithIcon from "../../components/PasswordInputWithIcon";
import CustomSingleFileInput from "../../components/CustomSingleFileInput";
import { updateError } from "../../redux/reducers/userSlice";

const Register = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user, navigate, dispatch]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: "",
    phoneNumber: "",
    profileImgURL: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordAgain: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number"),
  });

  const handleRegister = (values) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("passwordAgain", values.passwordAgain);
    formData.append("phoneNumber", values.phoneNumber);
    if (values.profileImgURL) {
      formData.append("profileImgURL", values.profileImgURL);
    }

    dispatch(signUpUser(formData));
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={SignUpBG}
          alt="Sign Up Background"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">Register</h1>

          <Formik
            initialValues={initialValues}
            onSubmit={handleRegister}
            validationSchema={validationSchema}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                {/* Optional Image Upload */}
                {/* <div className="flex justify-center">
                  <CustomSingleFileInput
                    onChange={(file) => setFieldValue("profileImgURL", file)}
                  />
                  <ErrorMessage
                    className="text-sm text-red-500"
                    name="profileImgURL"
                    component="span"
                  />
                </div> */}

                <InputWithIcon name="firstName" placeholder="Enter your first name" />
                <InputWithIcon name="lastName" placeholder="Enter your last name" />
                <InputWithIcon name="phoneNumber" placeholder="Enter your phone number" />
                <InputWithIcon name="email" placeholder="Enter your email" />
                <PasswordInputWithIcon name="password" placeholder="Enter your password" />
                <PasswordInputWithIcon name="passwordAgain" placeholder="Confirm your password" />

                <button
                  type="submit"
                  className="h-12 w-full bg-black text-white hover:bg-red-500 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
