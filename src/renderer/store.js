import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import consoleReducer from './slices/consoleSlice';

export default configureStore({
  reducer: {
    editor: editorReducer,
    console: consoleReducer,
  },
});
