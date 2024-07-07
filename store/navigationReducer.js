
import { createSlice } from "@reduxjs/toolkit";



const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    sort: "alphabetically",
  },
  reducers: {
    setSort(state, action) {
      state.sort = action.payload;
    },
   
    
  },
});

export default navigationSlice.reducer;
export const { setSort } = navigationSlice.actions;