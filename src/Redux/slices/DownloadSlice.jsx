import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
import { saveAs } from "file-saver";
import axios from "axios";
import { fetchActivites } from "./ActivityCheck";
export const downloadProgress = createAction("downloadData/progress");
export const downloadDirectoreis = createAsyncThunk(
  "downloadData/downlaod",
  async (folderdata, { dispatch, rejectWithValue, onDownloadProgress }) => {
    console.log("folderdatadownload", folderdata);
    try {
      // console.log("folderdatarrrr", folderdata);
      // let FolderPath = [
      //   folderdata?.data?.year,
      //   folderdata?.data?.project ,
      //   folderdata?.data?.drawingType ,
      //   ...(Array.isArray(folderdata?.data?.projectDirectories)
      //     ? folderdata?.data?.projectDirectories
      //     : []),
      //   ...(Array.isArray(folderdata?.currentName)
      //     ? folderdata?.currentName
      //     : [folderdata?.currentName]),
      // ].filter((value) => value !== null && value !==undefined)

      const FolderPath = folderdata?.data;

      FolderPath.push(folderdata?.currentName);
      const estimatedTimeout = 10 * 60 * 1000;
      console.log("FolderPathddddddddd", FolderPath);
      const response = await baseUrl.get(`AwsOperations/Download`, {
        params: { FolderPath: FolderPath },
        paramsSerializer: {
          indexes: null,
        },
        timeout: estimatedTimeout,
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Dispatch an action to update the progress state here if needed
          // console.log("Download Progress:", percentCompleted);
          dispatch(downloadProgress(percentCompleted));
        },
      });

      console.log("ooooooooodowload", response.data);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("File Downloaded", {
          body: `${response.data.fileName} has been downloaded successfully.`,
        });
      }
      // dispatch(fetchActivites());
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);

const downloadDataSlice = createSlice({
  name: "yearData",
  initialState: {
    downloadData: [],
    downloadProgress: 0,
    downloadloading: null,
  },

  reducers: {
    clearDownloadProgress: (state) => {
      state.downloadProgress = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(downloadDirectoreis.pending, (state) => {
        state.downloadloading = true;
      })
      .addCase(downloadDirectoreis.fulfilled, (state, action) => {
        state.downloadloading = false;
        state.downloadData = action.payload;

        try {
          const blob = action.payload;
          const url = URL.createObjectURL(blob); // Potential error point
          saveAs(url, action.payload.fileName);
        } catch (error) {
          console.error("Error creating object URL:", error);
        }
      })
      .addCase(downloadDirectoreis.rejected, (state, action) => {
        state.downloadloading = false;
        state.error = action.error.message;
      })
      .addCase(downloadProgress, (state, action) => {
        state.downloadProgress = action.payload;
      });
  },
});

export default downloadDataSlice.reducer;
export const { clearDownloadProgress } = downloadDataSlice.actions;
