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
    allSupabaseSports: [],
    navigation: []
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
    },
    setNavigation(state, action){
      state.navigation = action.payload
    }
  },
});

export const { setSelectedSport, setAllSports, setAllSportsFromSupabase, setNavigation } = sportSlice.actions;

export default sportSlice.reducer;
