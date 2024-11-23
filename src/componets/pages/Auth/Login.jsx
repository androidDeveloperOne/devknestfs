import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearLoginError,
  userLoginAction,
} from "../../../Redux/slices/UserSlice";
import { useAsyncValue, useNavigate } from "react-router-dom";
import ReusableInput from "../../../Resuable/ReusableInput";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const fixedInputClass =
  "rounded-2xl appearance-none relative block w-full h-12  my-2 md:text-lg px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10  md:text-sm  ";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    Email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
    // .matches(phoneregex, { message: "* Mobile number should be valid!" }),
    Password: Yup.string()
      .required("Password is required")
      .min(9, "Password must be at least 9 characters long"),
  });
  const userinfo = useSelector((state) => state?.auth);

  const { user, appErr, serverErr, loading } = userinfo;
  const [showHidePassword, setShowHidePassword] = useState(false);

  const [cookieData, setCookieData] = useState();
  console.log("cookieData",cookieData);
  useEffect(() => {
    if (cookieData) {
      // Convert the object to a JSON string
      const cookieValue = JSON.stringify(cookieData);
  
      // Set the cookie with the JSON string
      cookies.set("cookieData", cookieValue, {
        path: "/",
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
      });
    }
  }, [cookieData]);

  const loginHandler = async (values) => {
    const body = {
      userName: values.Email,
      Password: values.Password,
    };
    try {
      const response = await axios.post(
        "https://backend\.knestfs\.com:5000/api/Auth/Login",
        body,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        const { token, refreshToken } = await response.data;
        console.log("refreshToken", refreshToken);
        // Set the access token as an HTTP-only cookie
        cookies.set("token", token, {
          path: "/",
          httpOnly: true,
          secure: true, // Set to true if using HTTPS
        });

        cookies.set("refreshToken", refreshToken, {
          path: "/",
          httpOnly: true,
          secure: true, // Set to true if using HTTPS
        });
        // genrateRfreshToken(token, refreshToken);
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const genrateRfreshToken = async (token, refreshToken) => {
    const body = {
      token: token,
      refreshToken: refreshToken,
    };

    try {
      const response = await axios.post(
        "https://backend\.knestfs\.com:5000/api/Auth/GenrateNewAccessToken",
        body,
        {
          withCredentials: true,
        }
      );

      console.log("response");
      if (response.data) {
        // const { token, refreshToken } = await response.data;
        // console.log("refreshToken", refreshToken);
        // // Set the access token as an HTTP-only cookie
        // cookies.set("token", token, {
        //   path: "/",
        //   httpOnly: true,
        //   secure: true, // Set to true if using HTTPS
        // });

        // cookies.set("refreshToken", refreshToken, {
        //   path: "/",
        //   httpOnly: true,
        //   secure: true, // Set to true if using HTTPS
        // });

        setCookieData(response.data);
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    dispatch(clearLoginError());

    localStorage.removeItem("selectedCardIndex");
  }, [dispatch]);
  return (
    <div className="flex backgroundColor justify-center items-center min-h-screen">
      <div className="w-full md:w-3/4 px-4 lg:w-2/5">
        <div className="relative bg-white  shadow-black shadow-lg rounded-2xl mx-auto p-6 md:p-10 text-center text-lg md:text-2xl font-medium ">
          <h3 className="mb-3 text-gray-700 ">Welcome</h3>
          <Formik
            initialValues={{Email: "", Password: "" }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              dispatch(userLoginAction(values));
              navigate("/");

              // loginHandler(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="outline-0 border-none m-4 font-medium "
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col items-stretch">
                  <label className="text-l md:text-base  text-gray-700 self-start ps-2 ">
                    Email ID
                  </label>

                  <ReusableInput
                    name="Email"
                    placeholder="Enter Email"
                    handleChange={(e) => {
                      dispatch(clearLoginError());
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    value={values.Email}
                    className={fixedInputClass}
                    type="Email"
                  />
                  <label className="text-sm md:text-xs my-2 text-red-400">
                    {errors.Email}
                  </label>
                  <label className=" md:text-base text-gray-700 self-start ps-2">
                    Password
                  </label>

                  <ReusableInput
                    name="Password"
                    placeholder="Enter Password"
                    handleChange={(e) => {
                      dispatch(clearLoginError());
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    value={values.Password}
                    className={fixedInputClass}
                    type={showHidePassword ? "text" : "password"}
                    disableCopyPaste={true}
                  />
                  <div className=" flex ps-3">
                    <input
                      type="checkbox"
                      onChange={() => setShowHidePassword(!showHidePassword)}
                      checked={showHidePassword}
                    />
                    <label className="text-xs ps-2 my-2">
                      {showHidePassword ? "Hide Password" : "Show Password"}
                    </label>
                  </div>

                  <label className="text-sm md:text-xs my-2 text-red-400">
                    {errors.Password}
                  </label>

                  {appErr && (
                    <label className="text-sm md:text-xs  my-2 text-red-400">
                      {appErr}
                    </label>
                  )}
                  {loading && <LoadingScreen loading={loading} />}
                  <button
                    type="submit"
                    className="bg-[#1f51a6]  relative text-gray-700 font-medium rounded-2xl mt-4   px-3 "
                  >
                    <p className="text-white my-2 font-normal text-xl">Login</p>
                  </button>
                </div>
              </form>
            )}
          </Formik>

          <div className="flex justify-end pe-4">
            <a
              className=" text-sm cursor-pointer no-underline text-gray "
              onClick={() => navigate("/forgot_Password")}
            >
              <p className=" text-gray-700"> Forgot Password ?</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
