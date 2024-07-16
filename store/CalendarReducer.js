
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";


const initialState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1, // Monate sind nullbasiert, daher +1
  restDaysPerMonth: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    updateDate(state, action) {
      state.year = action.payload.year;
      state.month = action.payload.month;
    },
    setRestDays(state,action){
      state.restDaysPerMonth = action.payload
    },
  },
});


export default calendarSlice.reducer;
export const { updateDate, setRestDays} = calendarSlice.actions;