import { createSlice } from "@reduxjs/toolkit";
import { getMessageThunk, sendMessageThunk } from "./message.thunk";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    buttonLoading: false,
    screenLoading: false,
    messages: [],
    hasMore: true,
  },
  reducers: {
    setNewMessage: (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload];
    },
    clearMessages: (state) => {
      state.messages = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.buttonLoading = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages = [...state.messages, action.payload?.responseData];
        state.buttonLoading = false;
      })
      .addCase(sendMessageThunk.rejected, (state) => {
        state.screenLoading = false;
      });

    builder
      .addCase(getMessageThunk.pending, (state) => {
        state.buttonLoading = true;
      })
      .addCase(getMessageThunk.fulfilled, (state, action) => {
        const newMessages = action.payload?.responseData?.messages || [];

        if (action.meta.arg.page === 1) {
          state.messages = newMessages.reverse();
        } else {
          state.messages = [...newMessages.reverse(), ...state.messages];
        }

        state.hasMore = newMessages.length > 0;
        state.buttonLoading = false;
      })
      .addCase(getMessageThunk.rejected, (state) => {
        state.screenLoading = false;
      });
  },
});

export const { setNewMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
