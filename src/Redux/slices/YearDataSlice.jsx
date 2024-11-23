import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";

export const fetchYears = createAsyncThunk(
  "yearData/fetchYears",
  async (data, { dispatch, rejectWithValue }) => {
    console.log("dataatyear", data);
    if (data.DeleteCache) {
      try {
        const response = await baseUrl.get(`AwsOperations/GetYear?DeleteCache=${data.DeleteCache}`);

        console.log("responserr", response);
        return response.data.sort((a, b) => b.year - a.year);
      } catch (error) {
        throw new Error("Error fetching data:", error);
      }
    } else {
      try {
        const response = await baseUrl.get(`AwsOperations/GetYear`);

        console.log("responserr", response);
        return response.data.sort((a, b) => b.year - a.year);
      } catch (error) {
        throw new Error("Error fetching data:", error);
      }
    }
  }
);

const yearDataSlice = createSlice({
  name: "yearData",
  initialState: {
    data: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchYears.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchYears.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default yearDataSlice.reducer;
