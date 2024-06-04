
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";


const initialState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1, // Monate sind nullbasiert, daher +1
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    updateDate(state, action) {
      state.year = action.payload.year;
      state.month = action.payload.month;
    },
  },
});


export default calendarSlice.reducer;
export const { updateDate } = calendarSlice.actions;