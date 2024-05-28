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
    allSupabaseSports: []
  },
  reducers: {
    setSelectedSport(state, action) {
      state.selectedSport = action.payload;
    },
    setAllSports(state, action) {
      state.allSports = action.payload;
    },
    setAllSportsFromSupabase(state, action){
      state.allSupabaseSports = action.payload
    }
  },
});

export const { setSelectedSport, setAllSports, setAllSportsFromSupabase } = sportSlice.actions;

export default sportSlice.reducer;
