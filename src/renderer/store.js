import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import consoleReducer from './slices/consoleSlice';

export default configureStore({
  reducer: {
    workspace: workspaceReducer,
    console: consoleReducer,
  },
});
