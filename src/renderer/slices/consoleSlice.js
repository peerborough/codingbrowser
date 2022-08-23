import { createSlice } from '@reduxjs/toolkit';

export const consoleSlice = createSlice({
  name: 'console',
  initialState: {
    values: [],
  },
  reducers: {
    addLog: (state, action) => {
      state.values = [...state.values, action.payload];
    },
  },
});

export const { addLog } = consoleSlice.actions;

export default consoleSlice.reducer;
