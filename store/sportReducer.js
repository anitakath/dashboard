import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../services/supabaseClient";

const sportSlice = createSlice({
  name: "sport",
  initialState: {
    /* All, Cardio, Poledance, ... */
    selectedSport: "all",

    /* used for Navigation */
    currentSport: [],
    /**** ****/
    allSupabaseSports: [],
    /* used whenever a user wants to see poledance entries for march 2024 for example*/
    filteredEntriesByCurrentSportAndDate: [],

    allPlannedSports: [],
    /* needs to be changed to sortedEntriesByYearbyMonth: */
    sortedEntriesByMonth: [],
    //array with strings (name of sport)
    navigation: [],
    label: [],

    //user has no sports added, show an "alert" inside the Navigation.js
    showAlert: false,
  },
  reducers: {
    setSelectedSport(state, action) {
      state.selectedSport = action.payload;
    },
    setCurrentSport(state, action) {
      state.currentSport = action.payload;
    },
    setAllPlannedSports(state, action) {
      state.allPlannedSports = action.payload;
    },
    setAllSports(state, action) {
      state.allSports = action.payload;
    },
    setAllSportsFromSupabase(state, action) {
      state.allSupabaseSports = action.payload;
    },
    setFilteredEntriesByCurrentSportAndDate(state, action){
      state.filteredEntriesByCurrentSportAndDate = action.payload;
    },
    setSortedEntriesByMonth(state, action) {
      state.sortedEntriesByMonth = action.payload;
    },
    setNavigation(state, action) {
      state.navigation = action.payload;
    },
    setLabel(state, action) {
      state.label = action.payload;
    },
    setShowAlert(state, action){
      state.showAlert = action.payload;
    },
    deleteSport(state, action) {
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

      console.log(sportNameToDelete);
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
    },
  },
});

export const {
  setSelectedSport,
  setCurrentSport,
  setAllPlannedSports,
  setAllSports,
  setAllSportsFromSupabase,
  setFilteredEntriesByCurrentSportAndDate,
  setSortedEntriesByMonth,
  setNavigation,
  setLabel,
  deleteSport,
  setShowAlert,
} = sportSlice.actions;

export default sportSlice.reducer;
