import { configureStore } from "@reduxjs/toolkit";
import collectionSliceReducer from "../features/CollectionSlice";
import userSliceReducer from "../features/UserSlice";
import TagsSliceReducer from "../features/TagsSlice";
import signUpReducer from "../features/SignUpSlice";
import fieldReducer from "../features/CustomFieldsSlice";

const store = configureStore({
  reducer: {
    collectionId: collectionSliceReducer,
    userId: userSliceReducer,
    tags: TagsSliceReducer,
    signup: signUpReducer,
    fields: fieldReducer,
  },
});

export default store;
