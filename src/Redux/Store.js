import { combineReducers, configureStore } from "@reduxjs/toolkit";
import yearDataSlice from "./slices/YearDataSlice";

import yearWiseProject from "./slices/YearWiseProject";

import ProjectmainData from "./slices/ProjectMainDirectories";
import fileSearchData from "./slices/SearchQerySlice";
import userSlice from "./slices/UserSlice";

import { persistStore } from "redux-persist";

import ProjectSubData from "./slices/SubDirectriesSlice";
import QrScannedData from "./slices/QrScannerSlice";
import deptSlice from "./slices/deptSlice";
import manageUserSlice from "./slices/manageUser";
import StepperSlice from "./slices/StepperSlice";
import userTypeSlice from "./slices/userTypeSlice";
import awsDeleteSlice from "./slices/AwsDeleteSlice";
import downloadSlice from "./slices/DownloadSlice";
import createFolderSlice from "./slices/createFolderSlice";
import AdminResetPasswordSlice from "./slices/AdminResetPasswordSlice";
import resetPasswordSlice from "./slices/ResetPassword";
import fileActivityData from "./slices/ActivityCheck";

import fileActivityCreate from "./slices/ActivityCreate";

import deleteFolderData from "./slices/FolderDeleteSlice";

import deleteFileData from "./slices/FileDeleteSlice";
import filteredPDFData from "./slices/FileSearchSlice";
import freezeFolder  from "./slices/FreezeSlice";
const rootReducer = combineReducers({
  auth: userSlice,
  yearData: yearDataSlice,
  yearWiseProject: yearWiseProject,
  projectMain: ProjectmainData,
  projectSub: ProjectSubData,
  scannedData: QrScannedData,
  adminResetPassword: AdminResetPasswordSlice,
  dept: deptSlice,
  user: manageUserSlice,
  resetPassword: resetPasswordSlice,
  userType: userTypeSlice,
  stepperData: StepperSlice,
  searchData: fileSearchData,
  deleteFolder: deleteFolderData,
  delteFile: deleteFileData,
  downloadData: downloadSlice,
  createFolderData: createFolderSlice,
  activityData: fileActivityData,
  activityCreate: fileActivityCreate,
  filterFile: filteredPDFData,
  freezeFolder:freezeFolder
});

const store = configureStore({
  reducer: rootReducer,

  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // {
      //   // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

let persistor = persistStore(store);

export { store, persistor };
