import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";

export const projectMainDirectriesData = createAsyncThunk(
  "projectMain/projectmainDirectories",
  async (
    { year, project, pageNo = 1, pageSize = 30, deleteCache },
    { dispatch, getState, rejectWithValue }
  ) => {
    console.log("dataMain", year);

    try {
      const response = await baseUrl.get(
        `AwsOperations/GetProjectsSubDirectories`,
        {
          params: {
            Year: year,
            ProjectName: project,
            DeleteCache: deleteCache,
            pageNo: pageNo,
            PageSize: pageSize,
          },
        }
      );
      console.log("resposnemain", response.data);

      return response.data.sort((a, b) => b.drawingType - a.drawingType);
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);

//////////////////////////////////////////////////////////////////

export const filetrPDFWiseDataSub = createAsyncThunk(
  "projectMain/filterDataSub",
  async (folderdata, { dispatch, getState, rejectWithValue }) => {
    console.log("projectData", folderdata);
    try {
      let FolderPath1 = Array.isArray(folderdata.data)
        ? folderdata.data
        : [folderdata.data.year, folderdata.data.project];

      FolderPath1 = FolderPath1.filter(
        (value) => value !== null && value !== undefined && value.trim() !== ""
      );

      console.log("FolderPath1", FolderPath1);

      // let latestUpdatedData = FolderPath1 || FolderPath2;

      const response = await baseUrl.get(
        `AwsOperations/GetProjectFileUrls`,

        {
          params: {
            FolderPath: FolderPath1,
          },
          paramsSerializer: { indexes: null },
          // ...config,
        }
      );

      console.log("YYYYYYYY", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
);
//////////////////////////////////////////////////////////////////

// export const folderCountData = createAsyncThunk(
//   "projectMain/count",

//   async (data, { dispatch, getState, rejectWithValue }) => {
//     console.log("dataatmain", data);

//     try {
//       const response = await baseUrl.get(
//         `AwsOperations/GetProjectsMainDirectoriesCount`,
//         {
//           params: {
//             Year: data?.year,
//             ProjectName: data?.project,
//             DeleteCache: data?.deleteCache,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       throw new Error("Error fetching data:", error);
//     }
//   }
// );

const projectMainSlice = createSlice({
  name: "projectMain",
  initialState: {
    filterPDFSub: [],
    // folderCount: null,
    projectMainDirectoresData: [],
    projectMainData: [],
    hasMore: true,
    loading: false,
    error: null,
    PageSize: 30,
    pageNo: 1,
  },
  reducers: {
    clearprojectMainDirectriesData(state) {
      state.projectMainData = [];
      state.hasMore = true;
      state.pageNo = 1;
    },
    // clearfilterPDFWiseData(state) {
    //   state.filterPDF = [];
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(projectMainDirectriesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(projectMainDirectriesData.fulfilled, (state, action) => {
        const isPagination = action.meta.arg.pageNo > 1;
        if (action.payload.length === 0) {
          state.hasMore = false;

          console.log("state.hasMore", state.hasMore);
        } else {
          if (isPagination) {
            state.projectMainData = [
              ...state.projectMainData,
              ...action.payload,
            ];

            state.pageNo += 1;
          } else {
            state.projectMainData = action.payload;
            state.pageNo = 2;
          }
        }

        state.loading = false;

        console.log("state.loading", state.loading);
      })
      .addCase(projectMainDirectriesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    //////////////////////////////////////////////////////////////////////

    builder
      .addCase(filetrPDFWiseDataSub.pending, (state) => {
        state.floading = true;
      })
      .addCase(filetrPDFWiseDataSub.fulfilled, (state, action) => {
        state.floading = false;
        state.filterPDFSub = action.payload;

        console.log("state.filterPDF", state.filterPDFSub);
      })
      .addCase(filetrPDFWiseDataSub.rejected, (state, action) => {
        state.floading = false;
        state.error = action.error.message;
      });
    //////////////////////////////////////////////////////////////////////
    // builder
    //   .addCase(folderCountData.pending, (state) => {
    //     state.floading = true;
    //   })
    //   .addCase(folderCountData.fulfilled, (state, action) => {
    //     state.floading = false;
    //     state.folderCount = action.payload;
    //   })
    //   .addCase(folderCountData.rejected, (state, action) => {
    //     state.floading = false;
    //     state.error = action.error.message;
    //   });
  },
});

export const { clearprojectMainDirectriesData } = projectMainSlice.actions;
export default projectMainSlice.reducer;
