import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/user/user.slice'
import messageSlice from './slice/message/message.slice'
import  socketSlice  from './slice/socket/socket.slice'

export const store = configureStore({
  reducer: {
    userSlice,
    messageSlice,
    socketSlice
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socketSlice.socket"]
      }
    })
  )
})