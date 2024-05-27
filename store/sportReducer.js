import { createSlice } from "@reduxjs/toolkit";

const sportSlice = createSlice({
  name: "sport",
  initialState: {
    selectedSport: null,
    allSports: [
      { name: "Figure Skating", entries: [] },
      { name: "Poledance", entries: [] },
      { name: "Yoga", entries: [] },
    ],
  },
  reducers: {
    setSelectedSport(state, action) {
      state.selectedSport = action.payload;
    },
    setAllSports(state, action) {
      state.allSports = action.payload;
    },
  },
});

export const { setSelectedSport, setAllSports } = sportSlice.actions;

export default sportSlice.reducer;
