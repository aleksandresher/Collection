import { createSlice } from "@reduxjs/toolkit";

const signUp = createSlice({
  name: "signUp",
  initialState: false,
  reducers: {
    toggleSignUp: (state) => !state,
  },
});

export const { toggleSignUp } = signUp.actions;

export default signUp.reducer;
