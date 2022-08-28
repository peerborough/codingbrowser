import { configureStore } from '@reduxjs/toolkit';
import consoleReducer from './slices/consoleSlice';

export default configureStore({
  reducer: {
    console: consoleReducer,
  },
});
