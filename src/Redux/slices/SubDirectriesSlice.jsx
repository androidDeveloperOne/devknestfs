import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";

export const projectSubDirectroriesData = createAsyncThunk(
  "projectSubDir/projectSubDirectroriesData",
  async (data, { dispatch, getState, rejectWithValue }) => {
    console.log("*****ddsub", data);
    try {
      const requestBody = {
        year: data?.year,
        project: data?.project,
        projectDirectories: [
          data?.drawingType,
          ...(data?.projectDirectories || []),
        ],
        DeleteCache: data?.deleteCache,
      };
      // requestBody.filter(
      //   (value) =>
      //     // typeof value === "string" &&
      //     // value.trim() !== "" &&
      //     value === undefined
      // );

      // console.log(" filterRequestBody", filterRequestBody);
      console.log(" requestBodyatsub", requestBody);
      const url = `AwsOperations/GetProjectsDirectoriesData`;

      const response = await baseUrl.post(url, requestBody);
      const sortedData = response?.data?.map((item) => {
        const sortedFolders = item?.folders?.sort((a, b) => {
          return a?.name?.localeCompare(b?.name);
        });
        return { ...item, folders: sortedFolders };
      });

      return sortedData;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);
const projectSubDirSlice = createSlice({
  name: "projectSubDir",
  initialState: { projectSubdirectories: [] },
  reducers: {
    clearSubDirectiresData(state) {
      state.projectSubdirectories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(projectSubDirectroriesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(projectSubDirectroriesData.fulfilled, (state, action) => {
        state.loading = false;
        state.projectSubdirectories = action.payload;
        
      })
      .addCase(projectSubDirectroriesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { clearSubDirectiresData } = projectSubDirSlice.actions;
export default projectSubDirSlice.reducer;
