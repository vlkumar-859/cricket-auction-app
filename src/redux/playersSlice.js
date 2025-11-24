import { createSlice } from '@reduxjs/toolkit';
import players from '../utils/playersMockData';

const initialState = {
  players: Array.isArray(players) ? players : [],
  loading: false,
  error: null
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    // Add reducers here if needed
  }
});

export default playersSlice.reducer; 