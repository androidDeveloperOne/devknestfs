import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";


export const freezeFolder = createAsyncThunk(
  "freezeFolder",
  async (data, { rejectWithValue }) => {
    try {
      const body = {
        year: data?.year,
        project: data?.project,
      };

      const response = await baseUrl.post(`AwsOperations/Freeze`, body);

      return response.data;
    } catch (error) {
      if (error?.response && error?.response?.data) {
        if (error?.response?.data?.errors) {
          if (
            error?.response?.data?.errors?.Year &&
            error?.response?.data?.errors?.Project
          ) {
            return rejectWithValue(
              error?.response?.data?.errors?.Year[0] +
                "& " +
                error?.response?.data?.errors?.Project[0]
            );
          }
          if (error?.response?.data?.errors?.Year) {
            return rejectWithValue(error?.response?.data?.errors?.Year[0]);
          }
          if (error?.response?.data?.errors?.Project) {
            return rejectWithValue(error?.response?.data?.errors?.Project[0]);
          } else {
            return rejectWithValue(error?.response?.data?.errors);
          }
        } else {
          return rejectWithValue(error?.response?.data);
        }
      } else {
        return rejectWithValue({ message: "Failed to freeze folder." });
      }
    }
  }
);

export const unfreezeFolder = createAsyncThunk(
  "unfreezeFolder",
  async (data, { rejectWithValue }) => {
    try {
      const body = {
        year: data?.year,
        project: data?.project,
      };

      const response = await baseUrl.post(`AwsOperations/UnFreeze`, body);
      
      return response.data;
    } catch (error) {
      if (error?.response && error?.response?.data) {
        if (error?.response?.data?.errors) {
          if (
            error?.response?.data?.errors?.Year &&
            error?.response?.data?.errors?.Project
          ) {
            return rejectWithValue(
              error?.response?.data?.errors?.Year[0] +
                "& " +
                error?.response?.data?.errors?.Project[0]
            );
          }
          if (error?.response?.data?.errors?.Year) {
            return rejectWithValue(error?.response?.data?.errors?.Year[0]);
          }
          if (error?.response?.data?.errors?.Project) {
            return rejectWithValue(error?.response?.data?.errors?.Project[0]);
          } else {
            return rejectWithValue(error?.response?.data?.errors);
          }
        } else {
          return rejectWithValue(error?.response?.data);
        }
      } else {
        return rejectWithValue({ message: "Failed to freeze folder." });
      }
    }
  }
);

const freezeFolderSlice = createSlice({
  name: "freezeFolder",
  initialState: {
    folderfreezed: null,
    folderUnFreezed: null,
    freezeLoading: false,
    unFreezeLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(freezeFolder.pending, (state) => {
        state.freezeLoading = true;
        state.error = null;
      })
      .addCase(freezeFolder.fulfilled, (state, action) => {
        state.freezeLoading = false;
        state.folderfreezed = action.payload;
        state.serverErr = undefined;
        state.appErr = undefined;
      
      })
      .addCase(freezeFolder.rejected, (state, action) => {
        state.freezeLoading = false;
        state.serverErr = action.payload;
        state.appErr = action.payload;
        
      });

    builder.addCase(unfreezeFolder.pending, (state, action) => {
      state.unFreezeLoading = true;
    });
    builder.addCase(unfreezeFolder.fulfilled, (state, action) => {
      state.unFreezeLoading = false;
      state.folderUnFreezed = action?.payload;
      state.serverErr = undefined;
      console.log("state.folderfreezed==>",state.folderUnFreezed);
    });
    builder.addCase(unfreezeFolder.rejected, (state, action) => {
      state.unFreezeLoading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload;
    });
  },
});

export default freezeFolderSlice.reducer;
