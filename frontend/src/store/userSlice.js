import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { userInfo: null },
  reducers: {
    registerSuccess(state, action) {
      state.userInfo = action.payload;
    },
    registerFail(state, action) {
      state.userInfo = null;
    },
    loginSuccess(state, action) {
      state.userInfo = action.payload;
    },
    loginFail(state, action) {
      state.userInfo = null;
    },
    logoutSuccess(state, action) {
      state.userInfo = null;
    },
    logoutFail(state, action) {
      state.userInfo = null;
    },
    loadUserSuccess(state, action) {
      state.userInfo = action.payload;
    },
    loadUserFail(state, action) {
      state.userInfo = null;
    },
  },
});

export const {
  loginFail,
  loginSuccess,
  logoutFail,
  logoutSuccess,
  registerFail,
  registerSuccess,
  loadUserFail,
  loadUserSuccess,
} = userSlice.actions;
export default userSlice.reducer;
