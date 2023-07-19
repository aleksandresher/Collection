import { createSlice } from "@reduxjs/toolkit";

const TagsSlice = createSlice({
  name: "Tags",
  initialState: null,
  reducers: {
    setTags: (state, action) => action.payload,
  },
});

export const { setTags } = TagsSlice.actions;

export default TagsSlice.reducer;
