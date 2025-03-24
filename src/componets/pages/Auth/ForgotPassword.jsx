import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReusableInput from "../../../Resuable/ReusableInput";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearForgotError, clearpasswordData, forgotPasswordAction } from "../../../Redux/slices/UserSlice";
import { resetedPasswordData } from "../../../Redux/slices/ResetPassword";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import CustomAlert from "../../../Resuable/ReusableAlertBox";

const fixedInputClass =
  "rounded-2xl appearance-none relative block w-full h-12  my-2 md:text-lg px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10  md:text-sm  ";

const SignupSchema = Yup.object().shape({
  Email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotInfo = useSelector((state) => state?.auth);
  const [alertVisible, setAlertVisible] = useState(false);

  const { user, forgotError, serverErr, loading } = forgotInfo;
  const { passwordData } = useSelector(state => state?.auth);

  useEffect(() => {
    dispatch(clearpasswordData()); // Dispatch clearpasswordData on component mount
    dispatch(clearForgotError());
  }, [dispatch]);
  return (
    <div className="flex backgroundColor justify-center items-center min-h-screen">
      <div className="w-full md:w-3/4 px-4 lg:w-2/5">
        <div className="relative bg-white  shadow-black shadow-lg rounded-2xl mx-auto p-6 md:p-10 text-center text-lg md:text-2xl font-medium ">
          <h3 className="mb-3 text-gray-700 ">Forgot Password</h3>

          <Formik
            initialValues={{ Email: "" }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              dispatch(forgotPasswordAction(values))
              .then((resultAction) => {
                if (forgotPasswordAction.fulfilled.match(resultAction)) {
                  dispatch(resetedPasswordData());
                  dispatch(clearForgotError());
                  setAlertVisible(true);
                

                } else if (forgotPasswordAction.rejected.match(resultAction)) {

                }
              });
          
             

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
                <CustomAlert
                heading={"Otp Sent Successfuly"}
                visible={alertVisible}
                setVisible={(isVisible) => setAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() =>  navigate("/reset_Password")}

              />
                  <label className="text-l md:text-base  text-gray-700 self-start ps-2 ">
                    Email ID
                  </label>

                  <ReusableInput
                    name="Email"
                    placeholder="Enter Email"
                    handleChange={(e) => {
                      dispatch(clearForgotError());
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

                  {forgotError && (
                    <div>
                      <label className="text-sm md:text-xs my-2 text-red-400">
                        {forgotError}
                      </label>
                    </div>
                  )}
                       {loading &&   <LoadingScreen loading={loading} />}
                  <button
                    type="submit"
                    className="bg-[#1f51a6]  relative text-gray-700 font-medium rounded-2xl mt-4   px-3 "
                  >
                    <p className="text-white my-2 font-normal text-xl">Send OTP</p>
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
