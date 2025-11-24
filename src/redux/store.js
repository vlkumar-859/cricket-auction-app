import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './playersSlice';

const store = configureStore({
  reducer: {
    players: playersReducer
  }
});

export default store; 