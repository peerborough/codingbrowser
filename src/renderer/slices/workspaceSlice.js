import { createSlice } from '@reduxjs/toolkit';

export const editorSlice = createSlice({
  name: 'workspace',
  initialState: {
    rootPath: 'memory://',
    preload: '',
    execution: 'stop', // start, stop
  },
  reducers: {
    start: (state, action) => {
      const { preload } = action.payload;
      state.execution = 'start';
      state.preload = preload;
    },
    stop: (state, action) => {
      state.execution = 'stop';
      state.preload = null;
    },
    setPreloadScript: (state, action) => {
      state.preload = action.payload;
    },
  },
});

export const { start, stop, setPreloadScript } = editorSlice.actions;

export default editorSlice.reducer;
