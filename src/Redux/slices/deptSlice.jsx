import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../componets/baseUrl";

export const manageDeptAction = createAsyncThunk(
  "dept/getDept",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      let userstate = getState()?.auth;
      const token = userstate?.userdata?.token;
      const response = await baseUrl.get(`Department/GetDepartments`, {
        timeout: 30000,
        timeoutErrorMessage: "Connection Timeout",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedData = response.data.sort((a, b) =>
        a.departmentName.localeCompare(b.departmentName)
      );
      return sortedData;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const addDeptAction = createAsyncThunk(
  "dept/addDept",
  async (deptName, { dispatch, getState, rejectWithValue }) => {
    try {
      let userstate = getState()?.auth;
      const token = userstate?.userdata?.token;

      const body = {
        departmentName: deptName,
      };

      const response = await baseUrl.post(`Department/AddDepartment`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(manageDeptAction());
      return response.data;
    } catch (error) {
      if (error?.response && error?.response?.data?.Message) {
        return rejectWithValue(error?.response?.data);
      } else {
        return rejectWithValue(error?.message);
      }
    }
  }
);

export const updateDeptAction = createAsyncThunk(
  "dept/updateDept",
  async ({ id, deptName }, { dispatch, getState, rejectWithValue }) => {
    console.log("updateDeptActionupdateDeptActionupdateDeptAction", id);
    try {
      let userstate = getState()?.auth;
      const token = userstate?.userdata?.token;
      const body = {
        id: id,
        departmentName: deptName,
      };
      const data = await baseUrl.put(`Department/UpdateDepartment`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(manageDeptAction());
      return data;
    } catch (error) {
      if (error?.response && error?.response?.data?.Message) {
        return rejectWithValue(error?.response?.data?.Message);
      } else {
        return rejectWithValue(error?.Message);
      }
    }
  }
);

export const deleteDeptAction = createAsyncThunk(
  "dept/deleteDept",
  async (deptId, { dispatch, getState, rejectWithValue }) => {
    try {
      let userstate = getState()?.auth;
      const token = userstate?.userdata?.token;

      const response = await baseUrl.delete(
        `Department/DeleteDepartment?Id=${deptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(manageDeptAction());

      return response.data;
    } catch (error) {
      if (error.response && error?.response?.data?.Message) {
        return rejectWithValue(error?.response?.data?.Message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const setDeleteDeptError = (errorMessage) => ({
  type: "dept/setDeleteDeptError",
  payload: errorMessage,
});
const manageDeptSlice = createSlice({
  name: "dept",
  initialState: {
    error: null,
    loading: false,
    deptData: null,
    user: null,
    deleteData: null,
    updateDeptData: null,
    appErr: null,
    serverErr: null,
  },
  reducers: {
    clearDeleteData: (state, action) => {
        state.deleteData=null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(manageDeptAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(manageDeptAction.fulfilled, (state, action) => {
      state.deptData = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(manageDeptAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload?.message;
    });
    ///////////AddDept
    builder.addCase(addDeptAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addDeptAction.fulfilled, (state, action) => {
      state.user = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addDeptAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.Message;
      state.serverErr = action?.payload?.Message;
    });
    /////////////////updateDept
    builder.addCase(updateDeptAction.fulfilled, (state, action) => {
      state.updateDeptData = action?.payload?.data;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateDeptAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload;
    });
    /////////////////deleteDept

    builder.addCase(deleteDeptAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDeptAction.fulfilled, (state, action) => {
      state.deleteData = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteDeptAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.error?.message;
      state.serverErr = action?.payload;
    });
  },
});
export default manageDeptSlice.reducer;
export const{clearDeleteData} =manageDeptSlice.actions