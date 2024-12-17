import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
import { fetchActivites } from "./ActivityCheck";

export const deleteFileData = createAsyncThunk(
  "DeleteFile",
  async (data, { dispatch, getState, rejectWithValue }) => {
    console.log("datafile", data);
    try {

      let folderString = data?.data?.["*"] || "";
      
      let folderPathParameters = folderString.split("/");
      // const directoryPath= [
      //   data?.data?.year,
      //   data?.data?.project,
      //   data?.data?.drawingType,
      //   //  data?.data?.subDrawing,
      //   ...folderPathParameters,
      //   // ...(Array.isArray( data?.currentName) 
      //   //   ?  data?.currentName
      //   //   : [ data?.currentName]),
      // ].filter((value) => value !== null && value !== undefined && value.trim() !== "" );
      const directoryPath=data?.data
      console.log("folderPath at sliceiiii ", directoryPath );
      const requestBody = {
        fileName: data?.currentName,
        filePath:directoryPath,
      };
      console.log("requestBody", requestBody);

      const response = await baseUrl.delete("AwsOperations/DeleteFile", {
        data: requestBody, 
        headers: {
          "Content-Type": "application/json", 
        },
      });
      console.log("responseEEEEEEEEE ", response.data);
      // dispatch(fetchActivites());
      return response.data;
    } catch (error) {
      console.log("Error fetching data:", error.response.data);
      if (error && error.response.data && error.response) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

const DeleteFileSlice = createSlice({
  name: "deleteFile",
  initialState: { 
    
    deleteFileName: [] ,
    deleteFileloading:false,
    errorDeleteFile:[],
    deleteItemFile:false

},
  reducers: {
    clearDeleteFile(state) {
      state.deleteFileName = [];
      state.errorDeleteFile  = [];
      state.deleteItemFile=false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteFileData.pending, (state) => {
        state.deleteFileloading = true;
        state.deleteItemFile=false
        console.log("state.deleteFileName",        state.deleteFileloading);
      })
      .addCase(deleteFileData.fulfilled, (state, action) => {
        state.deleteFileloading = false;
        state.deleteFileName = action.payload
        state.deleteItemFile=true

      })
      .addCase(deleteFileData.rejected, (state, action) => {
        state.deleteFileloading = false;
        state.errorDeleteFile = action.payload;
      });
  }
});

export const {  clearDeleteFile} = DeleteFileSlice.actions;
export default DeleteFileSlice.reducer;
