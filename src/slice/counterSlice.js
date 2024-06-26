import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'counter',
  initialState: {
    userInfo: localStorage.getItem("userInfo")? JSON.parse(localStorage.getItem("userInfo")) : "logout"
  },
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInfo  = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { userLoginInfo } = userSlice.actions

export default userSlice.reducer