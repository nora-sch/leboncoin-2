import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/signInSlice";

export default configureStore({
  reducer: { 
    user: userReducer,
  },
});