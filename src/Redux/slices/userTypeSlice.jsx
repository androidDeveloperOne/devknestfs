import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../componets/baseUrl";
export const manageUserTypeAction = createAsyncThunk(
    'userType/getUserType',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            let userstate = getState()?.auth;
            const token = userstate?.userdata?.token;
            const response = await baseUrl.get(
                `UserType/GetUserTypes`, {
                timeout: 30000, timeoutErrorMessage: 'Connection Timeout', headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            return sortedData
        } catch (error) {
            if (error.response && error.response.data.message) {

                return rejectWithValue(error.response.data)

            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const addUserTypeAction = createAsyncThunk(
    'userType/addUserType',
    async (userTypeName, { dispatch, getState, rejectWithValue }) => {

        try {
            let userstate = getState()?.auth;
            const token = userstate?.userdata?.token;

            const body = {
                name: userTypeName
            };

            const response = await baseUrl.post(
                `UserType/AddUserType`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            );
            dispatch(manageUserTypeAction());
            return response.data;

        } catch (error) {
         
            if (error?.response && error?.response?.data?.Message) {

                return rejectWithValue(error?.response?.data?.Message);
            } else {
                return rejectWithValue(error?.response?.data?.Message);
            }
        }
    }


)
export const updateUserTypeAction = createAsyncThunk(
    'userType/updateUserType',
    async ({ id, userTypeName }, { dispatch, getState, rejectWithValue }) => {
      
        try {
            let userstate = getState()?.auth;
            const token = userstate?.userdata?.token;
            const body = {
                id: id,
                userTypeName: userTypeName

            };
            const response = await baseUrl.put(`UserType/UpdateUserTypes`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(manageUserTypeAction());
            return response.data;
        } catch (error) {
          
            if (error?.response && error?.response?.data?.Message) {
                return rejectWithValue(error?.response?.data?.Message);
            } else {
                return rejectWithValue(error?.Message);
            }
        }
    }
);

export const deleteUserTypeAction = createAsyncThunk(
    'userType/deleteUserType',
    async (userTypeId, { dispatch, getState, rejectWithValue }) => {

        try {
            let userstate = getState()?.auth;
            const token = userstate?.userdata?.token;

            const response = await baseUrl.delete(`UserType/DeleteUserType?Id=${userTypeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            dispatch(manageUserTypeAction());

            return response.data;
        } catch (error) {

            // ShortToast(error?.response?.data?.Message);
            if (error?.response && error?.response?.data?.Message) {

                return rejectWithValue(error?.response?.data?.Message)
            } else {
                return rejectWithValue(error?.message)
            }
        }
    },
);

const manageUserTypeSlice = createSlice({
    name: 'userType',
    initialState: {
        loading: false,
        userTypeData: null,
        updateUserTypeName: null,
        deleteUserTypedata: null,
        user: null,
        appErr: null,
        serverErr: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(manageUserTypeAction.pending, (state, action) => {
            state.loading = true;

        })
        builder.addCase(manageUserTypeAction.fulfilled, (state, action) => {
            state.userTypeData = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;

        })
        builder.addCase(manageUserTypeAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.error?.message;
            state.serverErr = action?.payload;

        })
        ///////////AddUserType
        builder.addCase(addUserTypeAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(addUserTypeAction.fulfilled, (state, action) => {
            state.user = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;

        })
        builder.addCase(addUserTypeAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;

        })
        //////////////////UpdateUserType
        builder.addCase(updateUserTypeAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateUserTypeAction.fulfilled, (state, action) => {
            state.updateUserTypeName = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;

        })
        builder.addCase(updateUserTypeAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload;
            state.serverErr = action?.payload;

        })
        /////////////////deleteUserType

        builder.addCase(deleteUserTypeAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteUserTypeAction.fulfilled, (state, action) => {

            state.deleteUserTypedata = action.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;

        });
        builder.addCase(deleteUserTypeAction.rejected, (state, action) => {

            state.loading = false;
            state.appErr = action.error?.message;
            state.serverErr = action?.payload;

        });

    }

})
export default manageUserTypeSlice.reducer
