
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";


const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state) {
      state.isLoggedIn = true
    },
    setLogout(state,action){
      state.isLoggedIn = false
    },
  },
});


export default authSlice.reducer;
export const { setLogin, setLogout } = authSlice.actions;