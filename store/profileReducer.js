import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    section: "sports",
  },
  reducers: {
    setSection(state, action) {
      state.section = action.payload;
    },
  },
});

export default profileSlice.reducer;
export const { setSection } = profileSlice.actions;
