import { configureStore } from '@reduxjs/toolkit'
import  userSlice from '../slice/counterSlice'


export default configureStore({
  reducer: {
    user: userSlice
  }
})