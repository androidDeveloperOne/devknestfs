import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

export const ResetPasswordAction = createAsyncThunk(
  'Reset/Password',
  async (resetPasswordData, { dispatch, getState, rejectWithValue }) => {
    try {
      const body = {
        userId: resetPasswordData?.userId,
        otp: resetPasswordData?.otp,
        password: resetPasswordData?.password,
        confirmPassword: resetPasswordData?.confirmPassword,
      };
     
   
      const response = await axios.post(
        'https://backend\.knestfs\.com:5000/api/Auth/ResetPasswordByUser',
        body,
        {
          timeout: 30000,
          timeoutErrorMessage: 'Connection Timeout',
        },
      );
   
      return response.data;
    } catch (error) {
     
      if (error?.response && error?.response?.data ) {
        if (error?.response?.data?.errors) {
          return rejectWithValue(error?.response?.data?.errors);
        } else {
       return rejectWithValue(error?.response?.data?.Message);
        }
      } else {
      
        return rejectWithValue(error);
      }
    }
  },
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    resetPasswordError: [],
    resetPasswordData: [],
  },
  reducers: {
    // userLogoutAction: state => {
    //   state.userdata = [];
    //   return state;
    // },
    // refreshTokenstore(state, action) {
    //   state.userdata = action.payload;
    //   return state;
    // },
    resetPasswordErr: state => {
      state.resetPasswordError = [];
    },
    resetedPasswordData: state => {
      state.resetPasswordData = [];
    },
    clearServerErr: state => {
      state.serverErr = null ;
    },
  },

  extraReducers: builder => {
    //User login action
    builder.addCase(ResetPasswordAction.pending, (state, action) => {
      state.loading = true;

    });
    builder.addCase(ResetPasswordAction.fulfilled, (state, action) => {
      state.resetPasswordData = action?.payload;
      state.loading = false;
      state.resetPasswordError = undefined;
      state.serverErr = undefined;
     
    });
    builder.addCase(ResetPasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.resetPasswordError = action?.payload;
      state.serverErr = action?.payload;
   
    });
  },
});

export const { resetPasswordErr, resetedPasswordData, clearServerErr } =
  resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
