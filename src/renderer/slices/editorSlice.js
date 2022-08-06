import { createSlice } from '@reduxjs/toolkit';

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    preload: {
      value: '',
      isDirty: false,
    },
  },
  reducers: {
    setPreloadScript: (state, action) => {
      state.preload.value = action.payload;
    },
  },
});

export const { setPreloadScript } = editorSlice.actions;

export default editorSlice.reducer;
