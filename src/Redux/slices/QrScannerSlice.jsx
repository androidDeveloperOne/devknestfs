import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import baseUrl from "../../componets/baseUrl";
import axios from "axios";

export const QrScanerData = createAsyncThunk(
  "Scanner",
  async (scannedData, { dispatch, getState, rejectWithValue }) => {
    console.log("scannedData", scannedData);
    try {
      const QrScanneddata = scannedData;

      const response = await baseUrl.get('Scanner/Scan', {
        params: {
          QrScanneddata: QrScanneddata,
        },
        paramsSerializer: { indexes: null },
      });

      console.log("qRresponse", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const QrData = createSlice({
  name: "QrScanner",
  initialState: {},
  reducers: {
    clearQrScannerData(state) {
      state.ScannerValue = [];
    },

    clearQrError(state){
      state.Qrerror=[]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(QrScanerData.pending, (state) => {
        state.loading = true;
      })
      .addCase(QrScanerData.fulfilled, (state, action) => {
        state.loading = false;
        state.ScannerValue = action.payload;
      })
      .addCase(QrScanerData.rejected, (state, action) => {
        state.loading = false;
        state.Qrerror = action.payload;
     

      });
  },
});
export const { clearQrScannerData, clearQrError}=QrData.actions
export default QrData.reducer;
