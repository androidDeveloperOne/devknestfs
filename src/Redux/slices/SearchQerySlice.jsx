import {createSlice} from '@reduxjs/toolkit';

const fileSearchData = createSlice({
  name: 'search',
  initialState: {
    searchQuery: [],
  },
  reducers: {
    setSearchQuerya(state, action) {
      state.searchQuery = action.payload;
    },
    clearSearchQuery(state) {
      state.searchQuery = '';

      // console.log("%%%",state.searchQuery);
    },
  },
});

export const {setSearchQuerya, clearSearchQuery} = fileSearchData.actions;
export default fileSearchData.reducer;
