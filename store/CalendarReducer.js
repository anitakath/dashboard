
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";



const calendarSlice = createSlice({
    name:"calendar",
    initialState:{
        date: null
    },
    reducers:{
        setDate(state, action){
               state.date = action.payload;
        }
    }
})


export default calendarSlice.reducer;
export const { setDate } = calendarSlice.actions;