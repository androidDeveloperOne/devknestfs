import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";
export const adminResetPassword = createAsyncThunk(
    'AdminReset/Password',
    async (rpdata, { dispatch, getState, rejectWithValue }) => {

        try {
            const body = {
                userId: rpdata?.userId,
                password: rpdata?.password,
                confirmPassword: rpdata?.confirmPassword,

            }
          
            const response = await baseUrl.post(
                `Auth/ResetPassword`, body)
              
            return response.data
        } catch (error) {
     
            if (error?.response && error?.response?.data) {
                return rejectWithValue(error?.response?.data)

            } else {
                return rejectWithValue(error?.response?.data)
            }
        }
    }
)







const AdminResetPasswordSlice = createSlice({
    name: 'adminResetPassword',
    initialState: {
        error: null,
        adminResetPasswordData: null,

    },
    reducers: {},
    extraReducers: (builder) => {
        //////////////////////
        builder.addCase(adminResetPassword.pending, (state, action) => {

            state.loading = true;
            
        })
        ////////////////////////
        builder.addCase(adminResetPassword.fulfilled, (state, action) => {
            state.adminResetPasswordData = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        })

        builder.addCase(adminResetPassword.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;
        })

    }
})

export default AdminResetPasswordSlice.reducer


















