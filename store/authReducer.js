
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";


const initialState = {
  isLoggedIn: false,
  userId: null,
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
    setUserId(state, action){
      state.userId = action.payload;
    }
  },
});


export default authSlice.reducer;
export const { setLogin, setLogout, setUserId } = authSlice.actions;