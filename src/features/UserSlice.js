import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userId",
  initialState: null,
  reducers: {
    setUserId: (state, action) => action.payload,
  },
});

export const { setUserId } = userSlice.actions;

export default userSlice.reducer;
