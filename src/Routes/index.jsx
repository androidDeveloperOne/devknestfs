import React from "react";
import { Route, Routes } from "react-router-dom";
import YearWiseProject from "../componets/pages/Home/YearWiseProject";
import YearWiseProjectDetails from "../componets/pages/Home/YearWiseProjectDetails";
import ProjectMainDirectories from "../componets/pages/Home/ProjectMainDirectories";

import SubDirectoriesProject from "../componets/pages/Home/SubDirectoriesProject";
import Profile from "../componets/pages/Profile/Profile";
import QrScanner from "../componets/pages/QrScanner";

import Otp from "../componets/pages/Auth/Otp";
import Login from "../componets/pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ManageUsers from "../componets/pages/ManageUsers/ManageUsers";
import CreateUser from "../componets/pages/ManageUsers/CreateUser";
import UserDetails from "../componets/pages/ManageUsers/UserDetails";
import ManageDepartments from "../componets/pages/ManageDepartment/ManageDepartments";
import DeptDetails from "../componets/pages/ManageDepartment/DeptDetails";
import NavbarContainer from "../navbar/NavbarContainer";
import Upload from "../componets/pages/Upload";
import ManageUserType from "../componets/pages/ManageUserType/ManageUserType";

import UpdateUserType from "../componets/pages/ManageUserType/UpdateUserType";
import { useSelector } from "react-redux";

import UpdateDepartment from "../componets/pages/ManageDepartment/UpdateDepartment";

import ForgotPassword from "../componets/pages/Auth/ForgotPassword";
import ResetPassword from "../componets/pages/Auth/ResetPassword";
import Home from "../componets/pages/ActivityIndicator/Home";
import StepperHorizontal from "../componets/stepper";

// import YearWiseProjectDetails from "../pages/Home/YearWiseProjectDetails";
const AppRoutes = () => {
  const userData = useSelector((state) => state?.auth?.userdata);

  const userType = userData?.userType;
  console.log("userType::::::::inRoute", userType);

  return (
    <div>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/OTPScreen" element={<Otp />} />
        <Route path="/forgot_Password" element={<ForgotPassword />} />
        <Route path="/reset_Password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<YearWiseProject />}></Route>

          <Route path="/:year" element={<YearWiseProjectDetails />}></Route>
          <Route path="/:year/:project" element={<ProjectMainDirectories />} />

          <Route
            path="/:year/:project/:drawingType/*"
            element={<SubDirectoriesProject />}
          />

          <Route path="/activity" element={<Home />} />

          {(userType === "Admin" ||
            userType === "Plant Admin" ||
            userType === "Group Admin") && (
            <>
              <Route path="/manageUsers" element={<ManageUsers />} />
              <Route path="/createUser" element={<CreateUser />} />
              <Route path="/userDetails/:item" element={<UserDetails />} />
            </>
          )}
          {userType === "Admin" && (
            <>
              <Route
                path="/manageDepartments"
                element={<ManageDepartments />}
              />
              <Route path="/deptDetails/:item" element={<DeptDetails />} />
              <Route
                path="/updateDepartment/:item/:id"
                element={<UpdateDepartment />}
              />
              <Route
                path="/updateDepartment/:item/:id"
                element={<UpdateDepartment />}
              />
              <Route path="/manageUserType" element={<ManageUserType />} />
              <Route
                path="/updateUserType/:item/:id"
                element={<UpdateUserType />}
              />
              <Route
                path="/updateUserType/:item/:id"
                element={<UpdateUserType />}
              />
            </>
          )}
          <Route path="/profile" element={<Profile />} />
          <Route path="/qrScanner" element={<QrScanner />} />
          <Route path="/Upload" element={<Upload />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
