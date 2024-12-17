import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  clearError,
  manageUserTypes,
  registerUser,
} from "../../../Redux/slices/manageUser";
import ReusableTextInput from "../../../Resuable/ReusableTextInput";
import ReusableDropdown from "../../../Resuable/ReusableDropdown";
import ReusableButton from "../../../Resuable/ReusableButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import ResuableIcons from "../../../Resuable/ResuableIcons";
import { manageDeptAction } from "../../../Redux/slices/deptSlice";
import CustomAlert from "../../../Resuable/ReusableAlertBox";
import LoadingScreen from "../../../Resuable/LoadingScreen";

function CreateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deptData = useSelector((state) => state?.dept?.deptData);
  const userTypeData = useSelector((state) => state?.user?.userType);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const { serverErr, loading } = useSelector((state) => state?.user);
  const { userType } = useSelector((state) => state?.auth?.userdata);

  const [filteredUserTypeData, setFilteredUserTypeData] = useState([]);
  const getFirstErrorMessage = () => {
    if (serverErr?.ConfirmPassword) {
      return serverErr?.ConfirmPassword[0];
    } else if (serverErr?.Email) {
      return serverErr?.Email[0];
    } else if (serverErr?.Password) {
      return serverErr?.Password[0];
    } else if (serverErr?.EmployeeId) {
      return serverErr?.EmployeeId[0];
    } else if (serverErr?.FirstName) {
      return serverErr?.FirstName;
    } else if (serverErr?.LastName) {
      return serverErr?.LastName;
    } else if (serverErr?.Mobile) {
      return serverErr?.Mobile[0];
    } else if (serverErr) {
      return serverErr;
    } else {
      return null;
    }
  };
  console.log("serverErr", serverErr);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const phoneRegExp = /^([+]\d{2})?\d{10}$/;
  const employeeIdRegExp = /^(KA|KV)\d{4,}$/;
  const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
  const passwordRegExp =
    /^(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{9,15}$/;
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Required")
      .matches(emailRegExp, "email is not valid"),
    mobile: Yup.string().matches(phoneRegExp, "Mobile number is not valid"),
    firstName: Yup.string()
      .required("Required")
      .min(2, "Too Short!")
      .max(50, "Too Long!"),
    lastName: Yup.string()
      .required("Required")
      .min(2, "Too Short!")
      .max(50, "Too Long!"),
    department: Yup.string().required("Required"),
    userType: Yup.string().required("Required"),
    employeeId: Yup.string().matches(
      employeeIdRegExp,
      "employeeId is not valid"
    ),

    password: Yup.string()
      .required("Required")
      .matches(
        passwordRegExp,
        "Password:9-15chars, 3 lowercase, 1 uppercase, 1 digit, 1 special char"
      ),
    confirmPassword: Yup.string()
      .required("Required")
      .test("passwords-match", "Passwords must match", function (value) {
        return value === this.parent.password;
      }),
  });
  useEffect(() => {
    dispatch(manageUserTypes());
    dispatch(manageDeptAction());
  }, [dispatch]);

  useEffect(() => {
    if (userType === "Plant Admin") {
      const filteredData = userTypeData?.filter(
        (userType) =>
          userType?.name === "Group Admin" || userType?.name === "Operational"
      );
      setFilteredUserTypeData(filteredData);
    } else if (userType === "Group Admin") {
      const filteredData = userTypeData?.filter(
        (userType) => userType?.name === "Operational"
      );
      setFilteredUserTypeData(filteredData);
    } else {
      setFilteredUserTypeData(userTypeData);
    }
  }, [userType, userTypeData]);

  useEffect(() => {
    if (serverErr) {
      setCustomAlertVisible(true);
    }
  }, [serverErr]);
  console.log("userdata", userTypeData, "::::::::::", filteredUserTypeData);
  return (
    <div>
      <Formik
        initialValues={{
          mobile: "",
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          department: "",
          userType: "",
          employeeId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          try {
            dispatch(registerUser(values))
              .then((resultAction) => {
                if (registerUser.fulfilled.match(resultAction)) {
                  dispatch(clearError());
                  setAlertVisible(true);
                }
              })
              .catch((error) => {})
              .finally(() => {
                setSubmitting(false);
                if (serverErr) {
                  setCustomAlertVisible(true);
                }
              });
          } catch (error) {}
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <div
            className={`flex-wrap content-center self-center flex flex-col items-center mt-24`}
          >
            <div className="flex-wrap content-center bg-white self-center flex flex-col items-center shadow-2xl rounded-md pb-14 px-14">
              <div
                className="self-end -mr-10 mt-2 cursor-pointer"
                onClick={() => navigate("/manageUsers")}
              >
                <ResuableIcons icon={"IoMdClose"} size={25} color={"red"} />
              </div>
              {/* ........................ServerErrMsg......................*/}
              {serverErr ? (
                <CustomAlert
                  heading={getFirstErrorMessage()}
                  visible={customAlertVisible}
                  setVisible={() => setCustomAlertVisible(false)}
                  title2={"Ok"}
                  showNo={true}
                  onclickClose={() => setCustomAlertVisible(false)}
                />
              ) : null}
              {/* ........................UserAddeddSuccessMsg......................*/}
              <CustomAlert
                heading={"User registered successfully"}
                visible={alertVisible}
                setVisible={(isVisible) => setAlertVisible(isVisible)}
                title2={"OK"}
                showNo={true}
                onclickClose={() => navigate("/manageUsers")}
              />
              <div>
                <ResuableIcons
                  icon={"PiUserCirclePlusFill"}
                  size={60}
                  color={"#1f51a6"}
                />
              </div>
              <h5>Register User</h5>
              <div></div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 py-14 auto-cols-max">
                  <div>
                    <ReusableTextInput
                      iconName={"FaUserCircle"}
                      label={"First Name"}
                      id={"firstName"}
                      value={values?.firstName}
                      action={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                    />
                    {errors.firstName ? (
                      <h6 className="text-red-500 mx-2">{errors.firstName}</h6>
                    ) : null}
                  </div>
                  <div>
                    <ReusableTextInput
                      iconName={"FaUserCircle"}
                      label={"Last Name"}
                      id={"lastName"}
                      value={values?.lastName}
                      action={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                    />
                    {errors.lastName ? (
                      <h6 className="text-red-500 mx-2">{errors.lastName}</h6>
                    ) : null}
                  </div>
                  <div>
                    <ReusableTextInput
                      iconName={"TbPasswordUser"}
                      label={"Password"}
                      id={"password"}
                      value={values?.password}
                      action={handleChange("password")}
                      onBlur={handleBlur("password")}
                      maxLength={15}
                      autoComplete={true}
                      disableCopyPaste={true}
                    />
                    {errors.password ? (
                      <h6
                        className={`text-red-500 ${
                          isMobile ? "max-w-64" : "max-w-64"
                        }`}
                      >
                        {errors.password}
                      </h6>
                    ) : null}
                  </div>
                  <div>
                    <ReusableTextInput
                      iconName={"TbPasswordUser"}
                      label={"Confirm Password"}
                      id={"confirmPassword"}
                      value={values?.confirmPassword}
                      action={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      maxLength={15}
                      autoComplete={true}
                      disableCopyPaste={true}
                    />
                    {errors.confirmPassword ? (
                      <h6 className="text-red-500 mx-2">
                        {errors.confirmPassword}
                      </h6>
                    ) : null}
                  </div>
                  <div>
                    <ReusableTextInput
                      iconName={"FaPhoneAlt"}
                      label={"Mobile"}
                      id={"mobile"}
                      value={values?.mobile}
                      maxLength={10}
                      action={handleChange("mobile")}
                      onBlur={() => {
                        handleBlur("mobile");
                      }}
                    />
                    {/* {errors.mobile ? <h6 className='text-red-500 mx-2'>{errors.mobile}</h6> : null} */}
                  </div>
                  <div>
                    <ReusableTextInput
                      iconName={"PiIdentificationBadgeFill"}
                      label={"EmployeeId"}
                      id={"employeeId"}
                      value={values.employeeId}
                      action={handleChange("employeeId")}
                      onBlur={handleBlur("employeeId")}
                    />
                    {errors.employeeId ? (
                      <h6 className="text-red-500 mx-2">{errors.employeeId}</h6>
                    ) : null}
                  </div>

                  <div>
                    <ReusableTextInput
                      iconName={"IoMail"}
                      label={"Email"}
                      id={"email"}
                      value={values.email}
                      action={handleChange("email")}
                      onBlur={handleBlur("email")}
                    />
                    {errors.email ? (
                      <h6 className="text-red-500 mx-2">{errors.email}</h6>
                    ) : null}
                  </div>

                  <div>
                    <ReusableDropdown
                      iconName={"FaUsers"}
                      placeholder={"User Type"}
                      data={filteredUserTypeData}
                      labelfield={"name"}
                      valuefield={"id"}
                      name={"userType"}
                      value={values.userType}
                      onChange={(e) =>
                        setFieldValue("userType", e.target.value)
                      }
                    />
                    {errors.userType ? (
                      <h6 className="text-red-500 mx-2">{errors.userType}</h6>
                    ) : null}
                  </div>
                  <div>
                    <ReusableDropdown
                      iconName={"FaBriefcase"}
                      placeholder={"Department"}
                      data={deptData}
                      labelfield={"departmentName"}
                      valuefield={"id"}
                      name={"department"}
                      value={values.department}
                      onChange={(e) =>
                        setFieldValue("department", e.target.value)
                      }
                    />
                    {errors.department ? (
                      <h6 className="text-red-500 mx-2">{errors.department}</h6>
                    ) : null}
                  </div>
                  {/* 
              <div> <ReusableDropdown
                    iconName={"FaCloudUploadAlt"}
                    name={'uploadAccess'}

                    data={accessData}
                    labelfield={'label'}
                    valuefield={'value'}
                    value={values.uploadAccess}
                    onChange={(e) => {
                      const booleanValue = JSON.parse(e.target.value);
                      setFieldValue('uploadAccess', booleanValue);
                    }}
                  />

                    {errors.uploadAccess ? <h6 className='text-red-500 mx-2'>{errors.uploadAccess}</h6> : null}</div>


                  <div>
                    <ReusableDropdown
                      iconName={"FaTrashAlt"}
                      data={accessData}
                      name={'deleteAccess'}
                      labelfield={'label'}
                      valuefield={'value'}
                      value={values.deleteAccess}
                      onChange={(e) => {
                        const booleanValue = JSON.parse(e.target.value);
                        setFieldValue('deleteAccess', booleanValue);
                      }}
                    />
                    {errors.deleteAccess ? <h6 className='text-red-500 mx-2'>{errors.deleteAccess}</h6> : null}
                  </div>  */}
                </div>
                {loading && <LoadingScreen loading={loading} />}
                <div className="flex flex-row justify-center content-around w-100">
                  <ReusableButton type="submit" title={"Save"} />
                </div>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default CreateUser;
