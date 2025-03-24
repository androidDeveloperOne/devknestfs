import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import baseUrl from "../../componets/baseUrl";


export const manageUserAction = createAsyncThunk(
    'user/getUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            ;
            const { data } = await baseUrl.get(
                `User/GetUsers`)
            const sortedData = data.sort((a, b) => a.firstName.localeCompare(b.firstName));
            console.log("%%%%%%%%%",sortedData);
            return sortedData

        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const manageUserTypes = createAsyncThunk(
    'user/getUserType',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await baseUrl.get(
                `UserType/GetUserTypes`)

            return data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)

            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)


export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (rdata, { dispatch, getState, rejectWithValue }) => {

        try {
            const body = {
                firstName: rdata?.firstName,
                lastName: rdata?.lastName,
                password: rdata?.password,
                confirmPassword: rdata?.confirmPassword,
                departmentId: rdata?.department,
                email: rdata?.email,
                mobile: rdata?.mobile,
                userTypeId: rdata?.userType,
                employeeId: rdata?.employeeId,
            }
            const data = await baseUrl.post(
                `Auth/Register`, body,)


            dispatch(manageUserAction())

            return data
        } catch (error) {


console.log("error?.response?.data",error?.response?.data);
            if (error?.response && error?.response?.data) {
                if (error?.response?.data?.errors) {
                    return rejectWithValue(error?.response?.data?.errors);
                } else {

                    return rejectWithValue(error?.response?.data);
                }
            } else {
                // Handle other types of errors
                return rejectWithValue(error);
            }

        }

    }


)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (udata, { dispatch, getState, rejectWithValue }) => {

        try {

            const body = {
                userId: udata?.userId,
                firstName: udata?.firstName,
                lastName: udata?.lastName,
                departmentId: udata?.department,
                email: udata?.email,
                mobile: udata?.mobile,
                userTypeId: udata?.userType,
                employeeId: udata?.employeeId,
                isActive:udata?.isActive
            }
            const data = await baseUrl.put(
                `User/UpdateUser`, body)

            dispatch(manageUserAction())
            console.log(":::::::::::::",data);
            return data
        } catch (error) {
            if (error?.response && error?.response?.data ) {
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
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (userid, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await baseUrl.delete(
                `User/DeleteUser`, {
                params: {
                    id: userid
                }
            })

            dispatch(manageUserAction())
            return data
        } catch (error) {

            if (error.response && error.response.data.Message) {

                return rejectWithValue(error.response.Message)

            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)



const manageUserSlice = createSlice({
    name: 'user',
    initialState: {
        error: null,
        registerUserdata: null,
        deleteData: null,
        updateUserData: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(manageUserAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(manageUserAction.fulfilled, (state, action) => {
                state.userData = action?.payload;
                state.loading = false;
                state.appErr = undefined;
                state.serverErr = undefined;
            })
            .addCase(manageUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload;
                state.serverErr = action?.payload?.message;
            });

        ///////////////////////////////////////////////////////
        builder.addCase(manageUserTypes.pending, (state, action) => {
            state.loading = true;
        })

        builder.addCase(manageUserTypes.fulfilled, (state, action) => {
            state.userType = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        })
        builder.addCase(manageUserTypes.rejected, (state, action) => {

            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;
        })

        ///////////////////////////////////////
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.registerUserdata = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;

        });

        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;

        });
        ////////////////////////////////

        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.updateUserData = action?.payload?.data;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
          });
          builder.addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;
          });
        /////////////////////////////
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.deleteData = action?.payload?.data;
            state.loading = false;
            state.appErr = action.error?.message;
            state.serverErr = action.error;

        })

        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;
            console.log("error!!!!!!!!!!!!!",action);
          });

    }

})
export const { clearError } = manageUserSlice.actions;
export default manageUserSlice.reducer
