import { createSlice } from "@reduxjs/toolkit";
import { deleteMessageForEveryoneThunk, deleteMessageForMeThunk, getMessageThunk, sendMessageThunk } from "./message.thunk";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    buttonLoading: false,
    screenLoading: false,
    messages: [],
    hasMore: true,
    unreadMessages: {},
  },
  reducers: {
    setNewMessage: (state, action) => {
      const newMessage = action.payload;
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, newMessage];
      const selectedUserId = JSON.parse(localStorage.getItem("selectedUser"))?._id;
      const isSelectedUser = selectedUserId === newMessage.senderId;

      if (!isSelectedUser) {
        const senderId = newMessage.senderId;
        if (!state.unreadMessages[senderId]) {
          state.unreadMessages[senderId] = [];
        }
        state.unreadMessages[senderId].push(newMessage);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.hasMore = true;
    },
    clearUnreadMessagesForUser: (state, action) => {
      delete state.unreadMessages[action.payload]; 
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

    builder
      .addCase(deleteMessageForMeThunk.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
      })
      .addCase(deleteMessageForEveryoneThunk.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
      });
  },
});

export const { setNewMessage, clearMessages, clearUnreadMessagesForUser } = messageSlice.actions;
export default messageSlice.reducer;
