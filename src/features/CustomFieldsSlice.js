import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const customFieldsSlice = createSlice({
  name: "customFields",
  initialState,
  reducers: {
    setCustomFields: (state, action) => action.payload,
  },
});

export const { setCustomFields } = customFieldsSlice.actions;

export default customFieldsSlice.reducer;
