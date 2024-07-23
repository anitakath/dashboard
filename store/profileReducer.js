import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    section: "sports",
    sportsArray: [],
  },
  reducers: {
    setSection(state, action) {
      state.section = action.payload;
    },
    setSportsArray(state, action) {
        console.log("Current state:", state); // Debugging-Ausgabe
        console.log("Action payload:", action.payload); // Debugging-Ausgabe

        if (action.payload) {
          if (!state.sportsArray) {
            console.error("sportsArray is undefined!"); // Fehlerausgabe
          } else {
            state.sportsArray.push(action.payload);
          }
        }
    },
  },
});

export default profileSlice.reducer;
export const { setSection, setSportsArray } = profileSlice.actions;
