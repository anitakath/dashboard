import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

const sportSlice = createSlice({
  name: "sport",
  initialState: {
    selectedSport: "Poledance",
    /********/
    //array with object .name, .color
    currentSport: [],
    /********/
    
    allSupabaseSports: [],
    /* needs to be changed to sortedEntriesByYearbyMonth: */
    sortedEntriesByMonth: [],
    //array with strings (name of sport)
    navigation: [],
    label: [],
  },
  reducers: {
    setSelectedSport(state, action) {
      state.selectedSport = action.payload;
    },
    
    setCurrentSport(state, action){
      state.currentSport = [action.payload]; 
    },
   

    
    setAllSports(state, action) {
      state.allSports = action.payload;
    },
    setAllSportsFromSupabase(state, action) {
      state.allSupabaseSports = action.payload;
    },
    setSortedEntriesByMonth(state, action) {
      state.sortedEntriesByMonth = action.payload;
    },
    setNavigation(state, action) {
      state.navigation = action.payload;
    },
    setLabel(state, action){
      state.label = action.payload;
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

  setAllSports,
  setAllSportsFromSupabase,
  setSortedEntriesByMonth,
  setNavigation,
  setLabel,
  deleteSport,
} = sportSlice.actions;

export default sportSlice.reducer;
