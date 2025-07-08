import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    section: "sports",
    sportsArray: [],
    selectedLayout: "list"
  },
  reducers: {
    setSection(state, action) {
      state.section = action.payload;
    },
    setSportsArrayy(state, action) {
      if (action.payload) {
        if (!state.sportsArray) {
          console.error("sportsArray is undefined!"); // Fehlerausgabe
        } else {
          state.sportsArray.push(action.payload);
        }
      }
    },
    setSelectedlayout(state, action){
      state.selectedLayout = action.payload;
    },
    replaceSportsArray(state, action){
      state.sportsArray = action.payload;
    },
    removeSport(state, action) {
      // Neue Action zum Entfernen eines Sports
      const entryIdToRemove = action.payload; // Erwarte die entryId des zu löschenden Sports
      state.sportsArray = state.sportsArray.filter(
        (sport) => sport.entryId !== entryIdToRemove
      );
    },
  },
});

export default profileSlice.reducer;
export const { setSection, setSportsArrayy, setSelectedlayout, removeSport, replaceSportsArray } = profileSlice.actions;
