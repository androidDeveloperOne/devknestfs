import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ReusableInput from "../../../Resuable/ReusableInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ResetPasswordAction,
  clearServerErr,
  resetPasswordErr,
  resetedPasswordData,
} from "../../../Redux/slices/ResetPassword";
import { Alert } from "react-bootstrap";
import { clearpasswordData } from "../../../Redux/slices/UserSlice";
import LoadingScreen from "../../../Resuable/LoadingScreen";
import CustomAlert from "../../../Resuable/ReusableAlertBox";

const ResetPassword = () => {

 
  const passwordRegExp = /^(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{9,15}$/;
  const otpRegExp = /^\d{4}$/

  const SignupSchema = Yup.object().shape({
    otp: Yup.string()
      .required("Required")
      .matches(otpRegExp, "Only Number Alloweds(Four Digits)"),
    password: Yup.string()

      .required('Required')
      .matches(passwordRegExp, 'Password:9-15chars, 3 lowercase, 1 uppercase, 1 digit, 1 special char'),

    confirmPassword: Yup.string()
      .required("Required")
      .test("passwords-match", "Passwords must match", function (value) {
        return value === this.parent.password;
      }),
  });
  const fixedInputClass =
    "rounded-2xl appearance-none relative block w-full h-12  my-2 md:text-lg px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10  md:text-sm  ";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordData } = useSelector((state) => state?.auth);
  const { resetPasswordData, loading, appErr, serverErr } = useSelector(
    (state) => state?.resetPassword
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [showHideConfirmPassword, setShowHideConfirmPassword] = useState(false);
  const getFirstErrorMessage = () => {
    if (serverErr?.Password) {
      return serverErr?.Password[0];
    } else if (serverErr?.ConfirmPassword) {
      return serverErr?.ConfirmPassword[0];
    } else if (serverErr) {
      return serverErr;
    } else {
      return null;
    }
  };
  useEffect(() => {
    dispatch(resetPasswordErr());
    dispatch(clearServerErr());
  }, [dispatch, passwordData]);
  console.log("loading:::::::", loading);
  return (
    <div className="flex backgroundColor justify-center items-center min-h-screen">
      <div className="w-full md:w-3/4 px-4 lg:w-2/5">
        <div className="relative bg-white  shadow-black shadow-lg rounded-3xl mx-auto p-6 md:p-10 text-center text-lg md:text-2xl font-medium ">
          <h3 className="mb-3 text-gray-700">Reset Password</h3>

          <Formik
            initialValues={{ otp: "", password: "", confirmPassword: "" }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              const payload = {
                userId: passwordData?.userId,
                otp: values?.otp,
                password: values?.password,
                confirmPassword: values?.confirmPassword,
              };

              dispatch(ResetPasswordAction(payload)).then((resultAction) => {
                if (ResetPasswordAction.fulfilled.match(resultAction)) {
                  dispatch(resetedPasswordData());
                  dispatch(clearServerErr());
                  dispatch(clearpasswordData());
                  if (!loading) {
                    setAlertVisible(true);
                  }
                } else if (ResetPasswordAction.rejected.match(resultAction)) {
                  // alert(getFirstErrorMessage())
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
                    heading={"Password Updated Successfully"}
                    visible={alertVisible}
                    setVisible={(isVisible) => setAlertVisible(isVisible)}
                    title2={"OK"}
                    showNo={true}
                    onclickClose={() => navigate(`/Login`)}
                  />
                  <label className="text-l md:text-base  text-gray-700 self-start ps-2 ">
                    Otp
                  </label>

                  <ReusableInput
                    name="otp"
                    placeholder="Enter 4-digit otp"
                    handleChange={(e) => {
                      dispatch(resetPasswordErr());
                      dispatch(resetedPasswordData());
                      dispatch(clearServerErr());
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    value={values.otp}
                    className={fixedInputClass}
                    type="text"
                  />
                  <label className="text-sm md:text-xs my-2 text-red-400">
                    {errors.otp}
                  </label>
                  <label className="text-l md:text-base  text-gray-700 self-start ps-2 ">
                    Passsword
                  </label>
                  <ReusableInput
                    name="password"
                    placeholder="Enter Passsword"
                    handleChange={(e) => {
                      dispatch(resetPasswordErr());
                      dispatch(resetedPasswordData());
                      dispatch(clearServerErr());
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    value={values.password}
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
                      {showHidePassword
                        ? "Hide New Password"
                        : "Show New Password"}
                    </label>
                  </div>

                  <label className="text-sm md:text-xs my-2 text-red-400">
                    {errors.password}
                  </label>
                  <label className="text-l md:text-base  text-gray-700 self-start ps-2 ">
                    Confirm Password
                  </label>
                  <ReusableInput
                    name="confirmPassword"
                    placeholder="Enter Confirm  New Password"
                    handleChange={(e) => {
                      dispatch(resetPasswordErr());
                      dispatch(resetedPasswordData());
                      dispatch(clearServerErr());
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    value={values.confirmPassword}
                    className={fixedInputClass}
                    type={showHideConfirmPassword? "text" : "password"}
                    disableCopyPaste={true}
                  />

                  <div className=" flex ps-3">
                    <input
                      type="checkbox"
                      onChange={() => setShowHideConfirmPassword(!showHideConfirmPassword)}
                      checked={showHideConfirmPassword}
                    />
                    <label className="text-xs ps-2 my-2">
                      {showHideConfirmPassword
                        ? "Hide New Password"
                        : "Show New Password"}
                    </label>
                  </div>

                  <label className="text-sm md:text-xs my-2 text-red-400">
                    {errors.confirmPassword}
                  </label>
                  {serverErr && (
                    <label className="text-sm md:text-xs  my-2 text-red-400">
                      {getFirstErrorMessage()}
                    </label>
                  )}
                  {loading ? <LoadingScreen loading={loading} /> : null}
                  <button
                    type="submit"
                    className="bg-[#1f51a6]  relative text-gray-700 font-medium rounded-2xl mt-4   px-3 "
                  >
                    <p className="text-white my-2 font-normal text-xl">

                      Save

                    </p>
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

export default ResetPassword;
