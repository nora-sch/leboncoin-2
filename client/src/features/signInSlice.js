import { createSlice } from "@reduxjs/toolkit";
const userLS = JSON.parse(localStorage.getItem("user"));

export const signInSlice = createSlice({
  name: "user",
  initialState: {
    user: userLS??null,
  },
  reducers: {
    add: (state, action) => {
      const newUserConnection = action.payload;
      state.user = newUserConnection;
      localStorage.setItem("user", JSON.stringify(newUserConnection));
    },
    remove: (state) => {
      state.user = null;
    },
  },
});

export const { add, remove } = signInSlice.actions;
export default signInSlice.reducer;
