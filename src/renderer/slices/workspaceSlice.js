import { createSlice } from '@reduxjs/toolkit';

export const editorSlice = createSlice({
  name: 'workspace',
  initialState: {
    preload: '',
    execute: 'stop', // start, stop
  },
  reducers: {
    setPreloadScript: (state, action) => {
      state.preload = action.payload;
    },
  },
});

export const { setPreloadScript } = editorSlice.actions;

export default editorSlice.reducer;
