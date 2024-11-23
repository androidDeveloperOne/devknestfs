import { createSlice } from "@reduxjs/toolkit";
const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem("__test__", "__test__");
    localStorage.removeItem("__test__");
    return true;
  } catch (e) {
    return false;
  }
};
const StepperSlice = createSlice({
  name: "folderName",

  initialState: {
    headerName: "Home",
    dynamicParameters: isLocalStorageAvailable()
      ? JSON.parse(localStorage.getItem("dynamicParameters")) || []
      : [],
  },
  reducers: {
    addName: (state, action) => {
      const { key, value, parameter, year, project } = action.payload;

      console.log("state at add name", parameter);

      console.log(" parameter********", parameter);
      const newParameter = {
        key,
        value,
        parameter,
        year,
        project,
      };

      state.dynamicParameters.push(newParameter);
      // localStorage.setItem(
      //   "dynamicParameters",
      //   JSON.stringify(state.dynamicParameters)
      // );
    },

    clearParameters: (state, action) => {
      const keyToRemove = action.payload;
      state.dynamicParameters = state.dynamicParameters.filter(
        (param) => param.key <= keyToRemove
      );
      console.log(" keyToRemove", action.payload, state.dynamicParameters);
      // localStorage.setItem(),
      //   "dynamicParameters",
      //   JSON.stringify(state.dynamicParameters)
      // );
    },
    setHeaderName: (state, action) => {
      state.headerName = action.payload;
    },
    clearHeaderName: (state, action) => {
      state.headerName = "";
    },
    clearAllParameters: (state) => {
      state.dynamicParameters = [];
    },

    addUpdatedActiveStep: (state) => {
      state.updatedActiveStep = [];
    },
  },
});

export const {
  addName,
  clearParameters,
  setHeaderName,
  clearHeaderName,
  clearAllParameters,
  addUpdatedActiveStep,
} = StepperSlice.actions;
export default StepperSlice.reducer;
