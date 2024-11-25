
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state) {
      state.isLoggedIn = true
    },
    setLogout(state){
      state.isLoggedIn = false
    },
    setUserId(state, action){
      state.userId = action.payload;
    },
    setUser(state, action){
      state.user = action.payload;
    }
  },
});


export default authSlice.reducer;
export const { setLogin, setLogout, setUserId, setUser} = authSlice.actions;