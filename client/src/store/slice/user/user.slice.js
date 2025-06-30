import { createSlice } from '@reduxjs/toolkit'
import { getOtherUsersThunk, getUserProfileThunk, loginUserThunk, logoutUserThunk, registerUserThunk } from './user.thunk';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    screenLoading: true,
    otherUsers: null,
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
    userProfile: null,
    buttonLoading: false,
    typingUsers: []
  },
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser", JSON.stringify(action.payload))
      state.selectedUser = action.payload;
    },
    setUserTyping: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeUserTyping: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        id => id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {

    //login
    builder
      .addCase(loginUserThunk.pending, (state, action) => {
        state.buttonLoading = true
      })
    builder
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload?.responseData?.user
        state.isAuthenticated = true;
        state.buttonLoading = false;
      })
    builder
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.buttonLoading = false
      })


    //register
    builder
      .addCase(registerUserThunk.pending, (state, action) => {
        state.buttonLoading = true
      })
    builder
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload?.responseData?.user
        state.isAuthenticated = true
        state.buttonLoading = false
      })
    builder
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.buttonLoading = false
      })

    //logout
    builder
      .addCase(logoutUserThunk.pending, (state, action) => {
      })
    builder
      .addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.userProfile = null;
        state.selectedUser = null;
        state.otherUsers = null;
        state.isAuthenticated = false;
        state.buttonLoading = false;
        localStorage.clear()
      })
    builder
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.buttonLoading = false
      })


    //profile
    builder
      .addCase(getUserProfileThunk.pending, (state, action) => {
        state.screenLoading = true
      })
    builder
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.screenLoading = false
        state.userProfile = action.payload?.responseData
      })
    builder
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.screenLoading = false
      })


    //get other users
    builder
      .addCase(getOtherUsersThunk.pending, (state, action) => {
        state.screenLoading = true
      })
    builder
      .addCase(getOtherUsersThunk.fulfilled, (state, action) => {
        state.screenLoading = false
        state.otherUsers = action.payload?.responseData
      })
    builder
      .addCase(getOtherUsersThunk.rejected, (state, action) => {
        state.screenLoading = false
      })
  },
})

// Action creators are generated for each case reducer function
export const { setUserTyping, setSelectedUser, removeUserTyping } = userSlice.actions

export default userSlice.reducer