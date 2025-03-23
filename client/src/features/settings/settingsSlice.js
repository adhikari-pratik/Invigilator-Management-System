import { createSlice } from '@reduxjs/toolkit';

// Get saved theme preference from local storage, default to light mode
const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme !== null) {
    return savedTheme === 'true';
  }
  // If no saved preference, use system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Initial state
const initialState = {
  darkMode: getInitialDarkMode(),
};

// Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
  },
});

// Selectors
export const selectDarkMode = (state) => state.settings.darkMode;

export const { toggleDarkMode, setDarkMode } = settingsSlice.actions;
export default settingsSlice.reducer;