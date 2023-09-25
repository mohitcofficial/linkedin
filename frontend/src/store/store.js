import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatPersonSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chatperson: chatReducer,
  },
});

export default store;
export const url = "http://localhost:4000/api";
