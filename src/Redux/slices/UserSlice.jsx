import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

import axios from "axios";
import Cookies from "js-cookie";
import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/es/storage";

export const userLoginAction = createAsyncThunk(
  "auth/login",
  async (loginData, { dispatch, getState, rejectWithValue }) => {
   
    try {
      const body = {
        userName: loginData.Email,
        Password: loginData.Password,
      };

      const response = await axios.post(
        `https://backend.knestfs.com:5000/api/Auth/Login`,
        body,
        { timeout: 30000, timeoutErrorMessage: "Connection Timeout" }
      );

      // let customresponse = {mobno: number, message: data};
      console.log("success",response.data);
      return response.data;
    } catch (error) {
      if (error?.response && error?.response?.data ) {
        console.log("loginError",error.response);
        if (error?.response?.data?.errors) {
          return rejectWithValue(error?.response?.data?.errors);
        } else {
       
          return rejectWithValue(error?.response?.data?.Message);
        }
      } else {
        // Handle other types of errors
        return rejectWithValue(error);
      }
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData, {dispatch, getState, rejectWithValue}) => {
    try {
      const body = {
        email: emailData.Email,
      };

      const response = await axios.post(
        'https://backend.knestfs.com:5000/api/Auth/ForgotPassword',
        body,
      );

      return response.data;
    } catch (error) {
      console.error('Error:', error.response.data.Message);
      const errorMessage =
        error.response && error.response.data && error.response.data.Message;
      if (errorMessage) {
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue(error.response.data);
      }
    }
  },
);

export const refreshTokenAction = createAsyncThunk(
  "auth/refreshToken",

  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      let tokendata = getState().auth?.userdata;
      let reqdata = {
        token: tokendata?.token,
        refreshToken: tokendata?.refreshToken,
      };

      const { data } = await axios.post(
        `https://backend.knestfs.com:5000/api/Auth/GenerateNewAccessToken`,
        reqdata,
        { timeout: 30000, timeoutErrorMessage: "Connection Timeout" }
      );
      Cookies.set('accessToken', data.accessToken);
      Cookies.set('refreshToken', data.refreshToken);
       dispatch(refreshTokenstore(data));

      console.log("generateToken",data);
      
      return data;
    } catch (error) {
      console.log("generateTokenerr",error);
      if (error.response) {


        if (error?.response?.status === 403) {
          dispatch(userLogoutAction());
        }
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const verifyOtpAction = createAsyncThunk(
  "auth/verifyotp",
  async (otp, { dispatch, getState, rejectWithValue }) => {
    try {
      let userstate = getState()?.auth;
      let usernumber = userstate?.user?.mobno;
      let reqdata = { userName: usernumber, otp: otp };

      const { data } = await axios.post(
        `https://backend.knestfs.com:5000/api/Auth/Login`,
        reqdata
      );

     
      dispatch(refreshTokenAction);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: "userauth",
  initialState: {
    appErr: null,
    passwordData: [],
    forgotError: null,
  },
  reducers: {
    userLogoutAction: (state) => {
      state.userdata = [];
      return state;
    },

    clearpasswordData: (state) => {
      state.passwordData = [];
    },
    refreshTokenstore(state, action) {
      state.userdata = action.payload;
      return state;
    },

    clearLoginError: (state) => {
      state.appErr = [];
    },

    clearForgotError: (state) => {
      state.forgotError = "";
    },
  },
  extraReducers: (builder) => {
    //User login action
    builder.addCase(userLoginAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userLoginAction.fulfilled, (state, action) => {
      state.userdata = action?.payload;
      state.loading = false;
      state.loginError = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userLoginAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload;
    });

   //forgot passowrd
   builder.addCase(forgotPasswordAction.pending, (state, action) => {
    state.loading = true;
  });
  builder.addCase(forgotPasswordAction.fulfilled, (state, action) => {
    state.passwordData = action?.payload;
    state.loading = false;
    state.forgotError = undefined;
    state.serverErr = undefined;
  });
  builder.addCase(forgotPasswordAction.rejected, (state, action) => {
    state.loading = false;
    state.forgotError = action?.payload;
    state.serverErr = action?.payload?.message;
  });
    //Otp verification
    builder.addCase(verifyOtpAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(verifyOtpAction.fulfilled, (state, action) => {
      state.userdata = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyOtpAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload?.message;
    });

    ///logout

    builder.addDefaultCase((state, action) => {
      const tokenExpiration = state?.userdata?.expiration;
      const token = state?.userdata?.token;

      if (tokenExpiration && token) {
        userLoginAction();
      }
    });
  },
});

  export const {
    userLogoutAction,
    refreshTokenstore,
    clearLoginError,
    clearpasswordData,
    clearForgotError

  } = userSlice.actions;

const persistConfig = {
  key: "userauth",
  storage: localStorage,
  whitelist: ["userdata","passwordData"],
};

const persistedtreducer = persistReducer(persistConfig, userSlice.reducer);
export default persistedtreducer;
