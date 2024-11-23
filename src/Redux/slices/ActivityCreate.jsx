import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";

export const uploadActivites = createAsyncThunk(
  "activity",
  async (folderData, { dispatch, rejectWithValue }) => {
    console.log("folderDataActivity", folderData);

    try {
      const folderDataPath = folderData?.data.split("/");

      if (folderData?.fileName) {
        folderDataPath.push(folderData.fileName);
      }

      console.log("folderDataPath", folderDataPath);
      // Check if the data contains an inner array
      const innerArray = folderDataPath.pop(); // Remove the last element
      console.log("innerArray", innerArray);
      // Check if the removed element is an array, stringify it and push it back
      if (Array.isArray(innerArray)) {
        folderDataPath.push(innerArray.join(", ")); // Join inner array elements into a single string
      } else if (innerArray !== undefined && innerArray !== null) {
        folderDataPath.push(innerArray); // Push the element back if it's not an array
      }

      console.log("folderDataPath", folderDataPath);
      // const folderDataPathString = folderDataPath.join('/')

      // .filter(
      //   (value) =>
      //     value !== null && value !== undefined && value.trim() !== ""
      // );
      // console.log("folderDataPathString", folderDataPathString);
      const [year, project,] = folderDataPath;

      const upatedfolderDataPath = folderDataPath.join("/");

      console.log("upatedfolderDataPath", upatedfolderDataPath);

      const requestBody = {
        title: folderData?.title,
        action: "Upload",
        module: "AWS",
        year: year || "",
        project: project || "",
        path: upatedfolderDataPath,
        description: "string",
        type: folderData?.fileType,
        
      };

      console.log("requestBody@@@@@@", requestBody);

      const url = "AwsOperations/AddActivity";

      const response = await baseUrl.post(url, requestBody);
      console.log("response77", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);

const activityCreateSlice = createSlice({
  name: "activityDataCreate",
  initialState: {
    loading: false, // Add the loading field
    uploadactivity: [],
    error: null,
    apiCallMade: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(uploadActivites.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadActivites.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadactivity = action.payload;
        state.apiCallMade = true;
      })
      .addCase(uploadActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default activityCreateSlice.reducer;
