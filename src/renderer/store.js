import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';

export default configureStore({
  reducer: {
    editor: editorReducer,
  },
});
