import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

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
    },
    deleteSport(state, action){
      const sportNameToDelete = action.payload;

      // Remove the sport from navigation
      state.navigation = state.navigation.filter(
        (sport) => sport !== sportNameToDelete
      );

      // Remove the sport from allSupabaseSports
      state.allSupabaseSports = state.allSupabaseSports.filter(
        (sport) => sport.name !== sportNameToDelete
      );

      // You can also add logic here to delete the sport from Supabase table

      console.log(sportNameToDelete)
      // Example:
      supabase
        .from("sports")
        .delete()
        .match({ name: sportNameToDelete })
        .then((response) => {
          if (response.error) {
            console.error(response.error.message);
          }
        });
    }
  },
});

export const {
  setSelectedSport,
  setAllSports,
  setAllSportsFromSupabase,
  setNavigation,
  deleteSport,
} = sportSlice.actions;

export default sportSlice.reducer;
