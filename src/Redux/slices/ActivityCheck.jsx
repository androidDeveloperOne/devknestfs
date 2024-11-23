import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../componets/baseUrl";
import { saveAs } from "file-saver";
export const fetchActivites = createAsyncThunk(
  "activities",
  async (payload, { dispatch, rejectWithValue }) => {

    console.log("data year",payload);
    
    try {

      let { data } = payload;
      let url = 'AwsOperations/GetActivities';

      if (payload && payload.data !== null) {
        let { data } = payload;
    
        // If data is a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            throw new Error('Invalid JSON string format.');
          }
        }
    
        // If data is an array and not empty, append to the URL
        if (Array.isArray(data) && data.length > 0) {
          const queryString = data.map(path => `Path=${(path)}`).join('&');
          url += `?${queryString}`;
        }
      }
      
      const response = await baseUrl.get(url);

      // Return the sorted data
      const sortedData = response.data.sort(
        (a, b) => new Date(b.datetime) - new Date(a.datetime)
      );
      return sortedData;

    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);
export const GetFilterActivites = createAsyncThunk(
  "activities/GetHeaders",
  async (activityData, { dispatch, rejectWithValue }) => {
    console.log("activityData", activityData);
    try {
      const response = await baseUrl.get("AwsOperations/GetHeaders", {
        // params: {
        //   Name: activityData.Name,
        // },
      });
      console.log("filterReposne", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);
export const GetActions = createAsyncThunk(
  "activities/GetActions",
  async (activityData, { dispatch, rejectWithValue }) => {
    console.log("activityData", activityData);
    try {
      const response = await baseUrl.get("AwsOperations/GetActions", {
        params: {
          Name: activityData.name,
        },
      });
      console.log("actionsReposne", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);
export const GetProjectActivity = createAsyncThunk(
  "activities/GetProjectActivity",
  async (activityData, { dispatch, rejectWithValue }) => {
    console.log("activityDataProject", activityData);
    try {
      const response = await baseUrl.get(
        "AwsOperations/GetProjectsForAcivity",
        {
          params: {
            Year: activityData.name,
          },
        }
      );
      console.log("actionsReposne", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);

export const GetCSVfile = createAsyncThunk(
  "activities/CSV",
  async (activityData, { dispatch, rejectWithValue }) => {
    console.log("activityData/csvFile", activityData);
    try {
      const response = await baseUrl.get("AwsOperations/GetActivitiesToCSV", {
        params: {
          Header: activityData.Name,
          Value: activityData.action,
          ProjectName: activityData.project,
          fromDate: activityData.startDate,
          toDate: activityData.endDate,
        },
        responseType: "blob",
      });

      console.log("RESPOSNE", response);
      const excelBlob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("File Downloaded", {
          body: `${excelBlob} has been downloaded successfully.`,
        });
      }
      console.log("CSVReposne", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data:", error);
    }
  }
);
const activityDataSlice = createSlice({
  name: "activityData",
  initialState: {
    activity: [],
    filterActivity: [],
    getAction: [],
    csvFile: [],
    projectactivity: [],
    error: null,
  },

  reducers: {
    clearActivityData(state) {
      state.filterActivity = [];
    },

    cleargetActionData(state) {
      state.getAction = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchActivites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivites.fulfilled, (state, action) => {
        state.loading = false;
        state.activity = action.payload;
      })
      .addCase(fetchActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(GetFilterActivites.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetFilterActivites.fulfilled, (state, action) => {
        state.filterloading = false;
        state.filterActivity = action.payload;
      })
      .addCase(GetFilterActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(GetCSVfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetCSVfile.fulfilled, (state, action) => {
        state.loading = false;
        state.csvFile = action.payload;
        try {
          const blob = action.payload;
          const url = URL.createObjectURL(blob); // Potential error point
          saveAs(url, action.payload.fileName);
        } catch (error) {
          console.error("Error creating object URL:", error);
        }
      })
      .addCase(GetCSVfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(GetActions.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetActions.fulfilled, (state, action) => {
        state.loading = false;
        state.getAction = action.payload;
      })
      .addCase(GetActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(GetProjectActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetProjectActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.projectactivity = action.payload;
      })
      .addCase(GetProjectActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default activityDataSlice.reducer;
export const { clearActivityData, cleargetActionData } =
  activityDataSlice.actions;
