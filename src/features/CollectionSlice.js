import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collectionId",
  initialState: null,
  reducers: {
    setCollectionId: (state, action) => action.payload,
  },
});

export const { setCollectionId } = collectionSlice.actions;

export default collectionSlice.reducer;
