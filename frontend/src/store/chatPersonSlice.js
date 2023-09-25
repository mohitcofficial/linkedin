import { createSlice } from "@reduxjs/toolkit";

const chatperson = createSlice({
  name: "chatperson",
  initialState: { chatPersonInfo: null, conversationId: null },
  reducers: {
    setChatperson(state, action) {
      state.chatPersonInfo = action.payload.user;
      state.conversationId = action.payload.conversationId;
    },
  },
});

export const { setChatperson } = chatperson.actions;
export default chatperson.reducer;
