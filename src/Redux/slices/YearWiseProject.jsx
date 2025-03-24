import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";

export const projectYearwise = createAsyncThunk(
  "projectDatails/projectDetailsData",
  async (year, { dispatch, rejectWithValue }) => {
    console.log("year***", year);

    if (year.pageSize) {
      try {
        const response = await baseUrl.get(
          `AwsOperations/GetProjects?Year=${
            year.year
          }&PageSize=${30}&pageNumber=${year.pageNo}`
        );

        return response.data.sort((a, b) => b.project - a.project);
      } catch (error) {
        throw new Error("Error fetching data:", error);
      }
    }

    if (year.deleteCache) {
  
      try {
        const response = await baseUrl.get(
          `AwsOperations/GetProjects?Year=${year.year}&pageNumber=${year.pageNo}&PageSize=${year.PageSize}&DeleteCache=${year.deleteCache}`
        );


        return response.data.sort((a, b) => b.project - a.project);
      } catch (error) {
        throw new Error("Error fetching data:", error);
      }
    }
    //  if (year) {
    try {
      console.log("kkkkkkkkkkkkkk");
      const response = await baseUrl.get(
        `AwsOperations/GetProjects?Year=${year.year}&pageNumber=${year.pageNo}&PageSize=${year.PageSize}`
      );

      return response.data.sort((a, b) => b.project - a.project);
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }

  // }
);

export const IsSearchProjectlist = createAsyncThunk(
  "projectDatails/projectListSearch",
  async (year) => {
    try {
      const response = await baseUrl.get(
        `AwsOperations/GetProjects?Year=${year}`
      );

      return response.data.sort((a, b) => b.project - a.project);
    } catch (error) {}
  }
);
export const projectFilesCount = createAsyncThunk(
  "projectDatails/projectFilesCount",
  async (year, { dispatch, rejectWithValue }) => {

    console.log("yearllllllllll",year);
    
    try {
      const response = await baseUrl.get(
        `/Counts/GetProjectFileCount?Year=${year.year}`
      );
      console.log("********", response.data);

      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);

const projectDetailsSlice = createSlice({
  name: "projectDatails",
  initialState: {
    error: null,
    projectYearWiseData: [],
    projectfiles: [],
    PageSize: 30,
    pageNo: 1,
    hasMore: true,
    loading: false,
    searchLoading: false,
    searchProject: [],
  },
  reducers: {
    clearProjectYearwiseData(state) {
      state.projectYearWiseData = [];
      state.hasMore = true;
      state.pageNo = 1;
    },

    clearSearchprojectlist(state) {
      state.searchLoading = false;
      state.searchProject = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(projectYearwise.pending, (state) => {
        state.loading = true;
      })
      .addCase(projectYearwise.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        const isPagination = action.meta.arg.pageNo > 1;

        console.log(" isPagination",  isPagination);
    
        if (action.payload.length === 0) {
          state.hasMore = false;
          console.log("state.hasMore", state.hasMore);
        } else {
          if (isPagination) {
            state.projectYearWiseData = [
              ...state.projectYearWiseData,
              ...action.payload,
            ];

            console.log(" state.projectYearWiseData",    state.projectYearWiseData);
            
            state.pageNo += 1; 
          } else {
            state.projectYearWiseData = action.payload;
            state.pageNo = 2; 
         
          }
        }

        state.loading = false;
      })
      .addCase(projectYearwise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    //////////
    builder
      .addCase(IsSearchProjectlist.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(IsSearchProjectlist.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchProject = action.payload;
      })
      .addCase(IsSearchProjectlist.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message;
      });
    /////
    builder
      .addCase(projectFilesCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(projectFilesCount.fulfilled, (state, action) => {
        state.loading = false;
        state.projectfiles = action.payload;
      })
      .addCase(projectFilesCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { clearProjectYearwiseData, clearSearchprojectlist } =
  projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;
