import { createSlice } from '@reduxjs/toolkit'
import { getMessageThunk, sendMessageThunk } from './message.thunk';

export const messageSlice = createSlice({
    name : 'message',
    initialState : {
        buttonLoading:false,
        screenLoading:false,
        messages:null
    },
    reducers : {
        setNewMessage : (state, action) => {
            const oldMessages = state.messages ?? [];
           state.messages = [...oldMessages, action.payload]
        }
    },
    extraReducers: (builder) => {

      //sendMessage
    builder
      .addCase(sendMessageThunk.pending, (state, action) => {
        state.buttonLoading = true
    })
    builder
    .addCase(sendMessageThunk.fulfilled, (state, action) => {
           state.messages = [...state.messages,action.payload?.responseData]
          state.buttonLoading = false;
      })
    builder
      .addCase(sendMessageThunk.rejected, (state, action) => {
       state.screenLoading = false
      })


      //getmessage
    builder
      .addCase(getMessageThunk.pending, (state, action) => {
        state.buttonLoading = true
    })
    builder
    .addCase(getMessageThunk.fulfilled, (state, action) => {
          console.log(action.payload)
          state.messages = action.payload?.responseData?.messages
          state.buttonLoading = false;
      })
    builder
      .addCase(getMessageThunk.rejected, (state, action) => {
       state.screenLoading = false
      })
  },
})

// Action creators are generated for each case reducer function
export const {setNewMessage} = messageSlice.actions

export default messageSlice.reducer