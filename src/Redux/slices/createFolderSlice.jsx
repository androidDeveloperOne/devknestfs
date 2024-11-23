import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
import { fetchActivites } from "./ActivityCheck";

export const createFolderName = createAsyncThunk(
  "creaetFolder",
  async (data, { dispatch, getState, rejectWithValue }) => {
    console.log("*****ddttt", data);

    try {
      let folderPath = data?.data?.updatedData1;
      console.log("folderPath at slice ", folderPath);
      const requestBody = {
        folderName: data?.folderName,
        folderPath: folderPath,
      };
      console.log("requestBody", requestBody);
      const url = `AwsOperations/CreateFolder`;

      const response = await baseUrl.post(url, requestBody);
      // dispatch(fetchActivites());
      return response.data;
    } catch (error) {
      // console.log("Error fetching data:", error.response.data);
      if (error && error.response.data && error.response) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

const createFolderSlice = createSlice({
  name: "createFolder",
  initialState: {
    folderCreateName: [],
    createLoading: false,
    folderCreateStatus: false,
  },
  reducers: {
    clearFolderCreateName(state) {
      state.folderCreateName = [];
      state.erroratcreate = [];
    },
    clearFolderStatus(state) {
      state.folderCreateStatus = false;
    },

    clearCreateLoading(state){
      state.createLoading=false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFolderName.pending, (state) => {
        state.createLoading = true;
        state.folderCreateStatus = false;
      })
      .addCase(createFolderName.fulfilled, (state, action) => {
        state.createLoading = false;
        state.folderCreateName = action.payload;
        state.folderCreateStatus = true;
        // console.log("state.createLoading", state.createLoading);
      })
      .addCase(createFolderName.rejected, (state, action) => {
        state.createLoading = false;
        state.erroratcreate = action.payload;

        // console.log("RRRRRRRR",  state.erroratcreate);
      });
  },
});

export const { clearFolderCreateName, clearFolderStatus ,clearCreateLoading} =
  createFolderSlice.actions;
export default createFolderSlice.reducer;
