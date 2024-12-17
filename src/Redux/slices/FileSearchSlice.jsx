import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
function flattenArray(arr) {
  return arr.reduce((flat, toFlatten) => 
    flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten), []
  );
}
export const filetrPDFWiseData = createAsyncThunk(
  "filterData",
  async (folderdata, { signal }) => {
    console.log("folderdata", folderdata);
    try {
      let FolderPath1 = Array.isArray(folderdata.data)
      ? flattenArray(folderdata.data)
      : flattenArray([
          folderdata.data.year,
          folderdata.data.project,
          folderdata.data.resultSegments,
        ]);
        console.log("FolderPath1", FolderPath1);
    
    // Filter out null, undefined, and empty strings
    FolderPath1 = FolderPath1.filter(value =>
      typeof value === 'string' && value.trim() !== ""
    );

      let filename = folderdata.data.searchQuery;
      // let latestUpdatedData = FolderPath1 || FolderPath2;
      console.log("FolderPath1", FolderPath1);
      console.log("filename33", filename);
      const estimatedTimeout = 10 * 60 * 1000;
      const response = await baseUrl.get(
        `Search/SearchDrawing`,

        {
          signal: signal,
          params: {
            FolderPath: FolderPath1,
            FileName: filename,
          },
          timeout: estimatedTimeout,
          timeout: estimatedTimeout,
          paramsSerializer: { indexes: null },
          // ...config,
        }
      );

      const processedData = response.data.map((item) => {
        const lastSlashIndex = item.name.lastIndexOf("/");

        const nameAfterLastSlash = item.name.substring(lastSlashIndex + 1);

        const { name, ...rest } = item;
        return {
          ...rest,
          name: nameAfterLastSlash,
        };
      });

      console.log("Processed Data:", processedData);
      return processedData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
);
const filterPDF = createSlice({
  name: "filterPDF",
  initialState: {
    filterPDF: [],
    floadingFilter: false,
  },
  reducers: {
    clearfilterPDFWiseData(state) {
      state.filterPDF = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filetrPDFWiseData.pending, (state) => {
        state.floadingFilter = true;
        console.log(" state.floadingFilter", state.floadingFilter);
      })
      .addCase(filetrPDFWiseData.fulfilled, (state, action) => {
        state.floadingFilter = false; // Resetting floadingFilter to false
        state.filterPDF = action.payload;

        console.log("state.filterPDF", state.filterPDF);
        console.log(" state.floadingFilter", state.floadingFilter);
      })
      .addCase(filetrPDFWiseData.rejected, (state, action) => {
        state.floadingFilter = false;
        state.filterPDF = action.payload;
        state.error = action.error.message;
      });
    //////////////////////////////////////////////////////////////////////
  },
});

export const { clearfilterPDFWiseData } = filterPDF.actions;
export default filterPDF.reducer;
