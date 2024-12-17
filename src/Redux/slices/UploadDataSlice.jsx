import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
import axios from "axios";

export const uploadProjectData = createAsyncThunk(
  "upload/uploadData",
  async (folderdata) => {
    console.log("dataslice", folderdata);

    try {
      // const folderPath = folderdata?.data.join(",");
      // let folderPath = Array.isArray(folderdata.data) ? folderdata.data : "";
      // console.log("folderPath", folderPath);

      // const FolderPath = folderdata.data.join(",");

      // const requestBody = {
      //   zipfile: folderdata?.file,
      // };
   
      const requestBody = {
        FolderPath: `/${folderdata?.data}`,
        replaceFiles: folderdata?.replaceFiles,
        files:folderdata?.file || [],
      };
      console.log("requestBody", typeof(requestBody));

      const params = {
        replaceFiles: folderdata?.replaceFiles,
      };

      // Convert the folderdata.data array into individual FolderPath entries

      const queryString = folderdata.data
        .map((value) => `FolderPath=${encodeURIComponent(value)}`)
        .join("&");

      // Final URL with query string parameters
      // const url = `UploadFolder/upload-zip?${queryString}&replaceFiles=${folderdata?.replaceFiles}`;


      const url="UploadFolder/upload-json"
      console.log("final URL", url);

      // console.log("FolderPath", FolderPath);
      // const url = "UploadFolder/upload-zip";

      const response = baseUrl.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },

      });
      console.log("resposneatupload", response);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data", error);
    }
  }
);

const uploadDataSlice = createSlice({
  name: "uploadData",
  initialState: {
    uploadFoldder: [],
    uploadLoading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadProjectData.pending, (state) => {
        state.uploadLoading = true;
      })
      .addCase(uploadProjectData.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadFoldder = action.payload;
      })
      .addCase(uploadProjectData.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.error.message;
      });
  },
});

export default uploadDataSlice.reducer;
