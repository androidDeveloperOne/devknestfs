import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
import { fetchActivites } from "./ActivityCheck";

export const deleteFolderData = createAsyncThunk(
  "DeleteFolder",
  async (data, { dispatch, getState, rejectWithValue }) => {
    console.log("*****ddtttfle", data);
    try {
      const directoryPath = data?.data;

      directoryPath.push(data?.currentName);

      console.log(" directoryPath ", directoryPath);
      // console.log("folderPath at slice ",newDirectory);
      const requestBody = {
        // folderName: data?.folderName,
        directoryPath: directoryPath,
      };
      console.log("requestBody", requestBody);

      const response = await baseUrl.delete("AwsOperations/Delete", {
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("responseEEEEEEEEE ", response.data);
      // dispatch(fetchActivites());
      const folderName = response.data.match(/'([^']+)'/)[1];
      return folderName;
    } catch (error) {
      console.log("Error fetching data:", error.response.data);
      if (error && error.response.data && error.response) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

const DeleteFolderSlice = createSlice({
  name: "deleteFolder",
  initialState: {
    deleteFolderName: "",
    deleteloading: false,

    deleteFolderItem:false
  },
  reducers: {
    clearDeleteFolder(state) {
      state.deleteFolderName = null;
      state.errorDeleteFolder = [];
      state.deleteFolderItem=false
    },
    clearDeleteLoding(state) {
      state.deleteloading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteFolderData.pending, (state) => {
        state.deleteloading = true;
        state.deleteFolderItem=false
      })
      .addCase(deleteFolderData.fulfilled, (state, action) => {
        state.deleteloading = false;
        state.deleteFolderItem=true;
        state.deleteFolderName = action.payload.replace(/\/$/, "");

        console.log("state.deleteFolderName", state.deleteFolderName);
      })
      .addCase(deleteFolderData.rejected, (state, action) => {
        state.deleteloading = false;
        state.errorDeleteFolder = action.payload;
      });
  },
});

export const { clearDeleteFolder ,clearDeleteLoding} = DeleteFolderSlice.actions;
export default DeleteFolderSlice.reducer;
