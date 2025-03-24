// import { createSlice } from "@reduxjs/toolkit";

// const AwsDeleteSlice = createSlice({
//   name: "folderName",
//   initialState: {
//     //   headerName: "Home",
//     dynamicParameters: [],
//   },
//   reducers: {
//     deletedName: (state, action) => {
//       const { key, value, parameter } = action.payload;
//       const newParameter = {
//         key,
//         value,
//         parameter,
//       };

//       if (state.dynamicParameters.length === 0) {
//         state.dynamicParameters.push(newParameter);
//       } else {
        
//         state.dynamicParameters = state.dynamicParameters.map((param, index) =>
//           index === 0 ? newParameter : param
//         );
//       }
//     },

//     clearDeletednames: (state, action) => {
//       const keyToRemove = action.payload;
//       state.dynamicParameters = state.dynamicParameters.filter(
//         (param) => param.key !== keyToRemove
//       );
//     },
//   },
// });

// export const { deletedName, clearDeletednames } = AwsDeleteSlice.actions;
// export default AwsDeleteSlice.reducer;
