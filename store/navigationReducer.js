
import { createSlice } from "@reduxjs/toolkit";



const navigationSlice = createSlice({
  name: "naviation",
  initialState: {
    sort: "alphabetically",
  },
  reducers: {
    setSort(state, action) {
      state.allSports = action.payload;
  
    },
  },
});

export default navigationSlice.reducer;
export const { setSort } = navigationSlice.actions;